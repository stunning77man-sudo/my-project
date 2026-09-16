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
  title: { text: 'Project total hours' },
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

.project-table,
.bar-chart {
  width: 50%;
  height: 360px;
}
</style>
