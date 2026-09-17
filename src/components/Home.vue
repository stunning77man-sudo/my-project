<script setup lang="ts">
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useProjectStore } from '@/stores/project'

const projectStore = useProjectStore()
const chartRef = ref<HTMLElement | null>(null)
let barChart: echarts.ECharts | null = null

const projectHours = computed(() => projectStore.data.reduce<Record<string, number>>((totals, item) => {
  totals[item.project] = (totals[item.project] ?? 0) + item.hours
  return totals
}, {}))

const barOption = computed<EChartsOption>(() => ({
  title: { text: 'Project Hours Distribution' },
  grid: { left: 50, right: 30, bottom: 90, containLabel: true },
  tooltip: {},
  xAxis: {
    type: 'category',
    data: Object.keys(projectHours.value),
    axisLabel: { interval: 0, rotate: 25 },
  },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: Object.values(projectHours.value) }],
}))

const isAdmin = computed(() => localStorage.getItem('role') === 'admin')

const columns = computed(() => [
  { title: 'ID', dataIndex: 'id', key: 'id' },
  { title: 'ProjectName', dataIndex: 'project', key: 'project' },
  { title: 'Overtime', dataIndex: 'overtime', key: 'overtime' },
  { title: 'Hours', dataIndex: 'hours', key: 'hours' },
  { title: 'CreatedAt', dataIndex: 'created_at', key: 'created_at' },
  ...(isAdmin.value ? [{ title: 'Options', key: 'options' }] : []),
])

const updateCharts = () => {
  barChart?.setOption(barOption.value, true)
}

const handleResize = () => {
  barChart?.resize()
}

const removePerson = (id: string) => {
  projectStore.removePerson(id)
}

watch(barOption, updateCharts, { deep: true })

onMounted(async () => {
  await nextTick()
  if (chartRef.value) {
    barChart = echarts.init(chartRef.value)
  }
  updateCharts()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  barChart?.dispose()
})
</script>

<template>
  <main class="home-page">
    <div class="content-row">
      <div class="table-wrapper">
        <a-table class="project-table" :columns="columns" :data-source="projectStore.data" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'overtime'">
              {{ record.overtime ? 'Yes' : 'No' }}
            </template>
            <template v-else-if="column.key === 'options' && isAdmin">
              <a-button danger @click="removePerson(record.id)">删除</a-button>
            </template>
          </template>
        </a-table>
      </div>
      <div ref="chartRef" class="bar-chart"></div>
    </div>
  </main>
</template>

<style scoped>
.home-page {
  padding: 24px;
}

.content-row {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

.table-wrapper,
.bar-chart {
  width: 50%;
  min-width: 0;
}

.table-wrapper {
  overflow: hidden;
}

.bar-chart {
  height: 360px;
}

:deep(.project-table .ant-table) {
  table-layout: fixed;
  width: 100%;
}

:deep(.project-table .ant-table-cell) {
  padding: 12px 6px;
  overflow-wrap: anywhere;
  word-break: break-word;
}

@media (max-width: 768px) {
  .home-page {
    padding: 12px;
  }

  .content-row {
    flex-direction: column;
    gap: 16px;
  }

  .table-wrapper,
  .bar-chart {
    width: 100%;
  }

  .bar-chart {
    height: 300px;
  }

  :deep(.project-table .ant-table-cell) {
    padding: 8px 3px;
    font-size: 12px;
  }
}
</style>
