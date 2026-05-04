import { financasData } from './financas.js'
import { essencialismoData } from './essencialismo.js'

export const conteudos = [
  {
    id: 'financas',
    title: 'Finanças Pessoais',
    subtitle: 'Educação Financeira',
    quote:
      '"A liberdade financeira acontece quando seus ativos geram mais renda do que seus passivos consomem."',
    icon: '◎',
    color: '#4ade80',
    data: financasData,
  },
  {
    id: 'essencialismo',
    title: 'Essencialismo',
    subtitle: 'A disciplinada busca por menos',
    quote: '"Faça menos, porém melhor." — Greg McKeown',
    icon: '◉',
    color: '#C17C3A',
    data: essencialismoData,
  },
]
