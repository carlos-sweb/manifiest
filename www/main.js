import m from "mithril"
import data from "./router.json" with { type: "json" }
import { css } from "../styled-system/css"
import { Menu, MenuItem, MenuTitle } from "panda-ui-mithril/menu"
import {
  Navbar,
  NavbarStart,
  NavbarEnd,
  NavbarBrand,
  NavbarToggle,
} from "panda-ui-mithril/navbar"
import {
  Drawer,
  DrawerBox,
  DrawerBackdrop,
  DrawerHeader,
  DrawerBody,
} from "panda-ui-mithril/drawer"
import { Title } from "panda-ui-mithril/title"
import { Text } from "panda-ui-mithril/text"
import { Link } from "panda-ui-mithril/link"
import { ThemeController } from "panda-ui-mithril/theme-controller"

m.route.prefix = "#"

const firstSlug = data.sections[0]?.link ?? ""

const sidebarClass = css({
  display: { base: "none", md: "flex" },
  flexDirection: "column",
  position: "fixed",
  top: "0",
  left: "0",
  width: "16rem",
  height: "100vh",
  overflowY: "auto",
  padding: "4",
  gap: "3",
  bg: "base-100",
  borderRightWidth: "1px",
  borderRightColor: "base-300",
  zIndex: "10",
})

const mobileBarClass = css({
  display: { base: "block", md: "none" },
  position: "sticky",
  top: "0",
})

const mobileBarHiddenClass = css({
  display: "none",
})

const sidebarGrowClass = css({
  flex: "1",
})

const mainClass = css({
  minHeight: "100vh",
  paddingTop: "8",
  paddingBottom: "8",
  maxWidth: "56rem",
  marginLeft: { base: "0", md: "16rem" },
  paddingLeft: { base: "4", md: "12" },
  paddingRight: { base: "4", md: "8" },
})

const metaClass = css({
  display: "flex",
  alignItems: "center",
  flexWrap: "wrap",
  gap: "2",
  marginBottom: "8",
})

function applyTheme(dark) {
  if (dark) document.documentElement.setAttribute("data-theme", "dark")
  else document.documentElement.removeAttribute("data-theme")
}

function sectionNav(onNavigate) {
  const current = m.route.get()
  return m(Menu, { size: "sm" }, [
    m(MenuTitle, data.title),
    ...data.sections.map((item) =>
      m(
        MenuItem,
        {
          href: `#/${item.link}`,
          active: current === `/${item.link}`,
          onclick: () => {
            if (onNavigate) onNavigate()
          },
        },
        item.text
      )
    ),
  ])
}

function themeToggle(state) {
  return m(ThemeController, {
    theme: "dark",
    size: "sm",
    checked: state.dark,
    onchange: (theme) => {
      state.dark = Boolean(theme)
      applyTheme(state.dark)
    },
  })
}

const Header = {
  view: () =>
    m("header", [
      m(Title, { as: "h1", size: "2", weight: "bold" }, data.title),
      m("div", { className: metaClass }, [
        m(Text, { as: "span", size: "sm", color: "neutral" }, [
          "Por ",
          m(Link, { href: data.author_link || `#/${firstSlug}`, color: "primary" }, data.author),
        ]),
        m(Text, { as: "span", size: "sm", color: "neutral" }, "•"),
        m(Text, { as: "span", size: "sm", color: "neutral" }, data.date),
      ]),
    ]),
}

function Section() {
  return {
    view: ({ attrs }) => {
      const section =
        data.sections.find((s) => s.link === attrs.slug) ?? data.sections[0]
      return m("main#main-content", { className: mainClass }, [
        m(Header),
        m.trust(section?.html ?? ""),
      ])
    },
  }
}

const Layout = {
  oninit(vnode) {
    vnode.state.drawerOpen = false
    vnode.state.dark =
      document.documentElement.getAttribute("data-theme") === "dark"
  },
  view(vnode) {
    const state = vnode.state
    const closeDrawer = () => {
      state.drawerOpen = false
    }
    return [
      m("div", { className: state.drawerOpen ? mobileBarHiddenClass : mobileBarClass }, [
        m(Navbar, { border: true, size: "sm", color: "base" }, [
          m(NavbarStart, [
            m(NavbarToggle, {
              open: state.drawerOpen,
              onclick: () => {
                state.drawerOpen = !state.drawerOpen
              },
            }),
            m(NavbarBrand, { href: `#/${firstSlug}` }, data.title),
          ]),
          m(NavbarEnd, [themeToggle(state)]),
        ]),
      ]),
      m("aside", { className: sidebarClass }, [
        m("div", { className: sidebarGrowClass }, sectionNav()),
        themeToggle(state),
      ]),
      m(
        Drawer,
        {
          open: state.drawerOpen,
          position: "start",
          size: "sm",
          labelledby: "nav-drawer-title",
          onclose: closeDrawer,
          onclosed: closeDrawer,
          onchange: (open) => {
            state.drawerOpen = open
          },
        },
        [
          m(DrawerBox, [
            m(DrawerHeader, [
              m("h3", { id: "nav-drawer-title" }, data.title),
            ]),
            m(DrawerBody, [sectionNav(closeDrawer)]),
          ]),
          m(DrawerBackdrop, { onclick: closeDrawer }),
        ]
      ),
      vnode.children,
    ]
  },
}

m.route(document.getElementById("app"), `/${firstSlug}`, {
  "/:slug": {
    render: (vnode) => m(Layout, m(Section, vnode.attrs)),
  },
})
