import { defineStore } from 'pinia'

export interface Person {
  id: string
  project: string
  overtime: boolean
  hours: number
  created_at: string
}

const initialData: Person[] = [
  {
    id: '001',
    project: 'Road Project A',
    overtime: true,
    hours: 3.5,
    created_at: '2024-04-10 10:30',
  },
  {
    id: '002',
    project: 'Bridge Maintenance B',
    overtime: false,
    hours: 2,
    created_at: '2024-04-09 13:00',
  },
  {
    id: '003',
    project: 'Pipeline Fix C',
    overtime: true,
    hours: 4.5,
    created_at: '2024-04-08 08:00',
  },
  {
    id: '004',
    project: 'Bridge Maintenance B',
    overtime: true,
    hours: 3,
    created_at: '2024-04-07 16:45',
  },
  {
    id: '005',
    project: 'Tunnel Cleaning D',
    overtime: false,
    hours: 8.1,
    created_at: '2024-04-03 11:43',
  },
]

export const useProjectStore = defineStore('project', {
  state: () => ({
    data: initialData,
  }),
  actions: {
    removePerson(id: string) {
      this.data = this.data
        .filter((person) => person.id !== id)
        .map((person, index) => ({
          ...person,
          id: String(index + 1).padStart(3, '0'),
        }))
    },
  },
})
