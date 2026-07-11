import { ResultItem } from '../types/result';

export const results: ResultItem[] = [
  {
    id: '1',
    name: 'Glucosa en Ayunas',
    date: '15 Jun 2024',
    value: '126',
    unit: 'mg/dL',
    badge: 'Atención',
    tone: 'danger',
    icon: '∿',
  },
  {
    id: '2',
    name: 'Colesterol Total',
    date: '10 Jun 2024',
    value: '215',
    unit: 'mg/dL',
    badge: 'Precaución',
    tone: 'warning',
    icon: '◌',
  },
  {
    id: '3',
    name: 'Hemoglobina A1C',
    date: '28 May 2024',
    value: '5.4',
    unit: '%',
    badge: 'Normal',
    tone: 'success',
    icon: '∿',
  },
];