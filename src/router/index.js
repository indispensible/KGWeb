import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import display from '@/components/display'
import index from '../index'
import KnowledgeData from '../KnowledgeData'
import Search from '../Search'
import SVGForceGraph from '../SVGForceGraph'
import DomainConceptRetrieval from '../DomainConceptRetrieval'
import EntityLink from '../EntityLink'
import EntityRecognition from '../EntityRecognition'
import SentenceClassification from '../SentenceClassification'
import ElementGraph from '../showElementsGraph'
import Discover from '../Discover'
import APIKGSummary from '../APIKGSummary'
import Overview from '../Overview_v2'
import Overview_v1 from '../Overview'
import task from '../task'
import entitySearch from '../entity_search'

Vue.use(Router)

export default new Router({
  // base: '/APISummary/',
  routes: [
    {
      path: '/df',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/display',
      name: 'display',
      component: display
    },
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/Search',
      name: 'Search',
      component: Search
    },
    {
      path: '/KnowledgeData/:id',
      name: 'KnowledgeData',
      component: KnowledgeData
    },
    {
      path: '/SVGForceGraph/:id',
      name: 'SVGForceGraph',
      component: SVGForceGraph
    },
    {
      path: '/ConceptGraphExtraction',
      name: 'DomainConceptRetrieval',
      component: DomainConceptRetrieval
    },
    {
      path: '/EntityLink',
      name: 'EntityLink',
      component: EntityLink
    },
    {
      path: '/EntityRecognition',
      name: 'EntityRecognition',
      component: EntityRecognition
    },
    {
      path: '/KnowledgePatternPrediction',
      name: 'SentenceClassification',
      component: SentenceClassification
    },
    {
      path: '/ElementGraph/:id',
      name: 'ElementGraph',
      component: ElementGraph
    },
    {
      path: '/Discover',
      name: 'Discover',
      component: Discover
    },
    {
      path: '/APIKGSummary',
      name: 'APIKGSummary',
      component: APIKGSummary
    },
    {
      path: '/Overview',
      name: 'Overview',
      component: Overview
    },
    {
      path: '/Overview_v1',
      name: 'Overview_v1',
      component: Overview_v1
    },
    {
      path: '/task',
      name: 'task',
      component: task
    },
    {
      path: '/entitySearch',
      name: 'entitySearch',
      component: entitySearch
    }
  ]
})
