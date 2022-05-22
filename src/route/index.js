import { createRouter, createWebHistory } from 'vue-router'
const home = () => import("../pages/home")
const login = () => import("../pages/login")
const database = () => import("../pages/database")
const user = () => import("../pages/user")
const mine = () => import("../pages/mine")
const play = () => import("../pages/play")
const instance = () => import("../pages/instance")
const register = () => import("../pages/register")

const routes = [
  { path: "/", redirect: "/home" },
  {
    path: "/home",
    name: "home",
    component: home,
	children: [
		{
		  path: "/home",
		  name: "play",
		  component: play,
		},
		{
		  path: "/home/user",
		  name: "user",
		  component: user
		},
		{
		  path: "/home/database",
		  name: "database",
		  component: database
		},
		{
		  path: "/home/mine",
		  name: "mine",
		  component: mine
		},
		{
		  path: "/home/instance",
		  name: "instance",
		  component: instance
		}
	]
  },
  {
    path: "/login",
    name: "login",
    component: login
  },
  {
    path: "/register",
    name: "register",
    component: register
  }
]

export const router =  createRouter({
	history: createWebHistory(),
	routes
})