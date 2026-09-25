import m from "mithril"
import data from "./router.json" with { type: "json" }
import mermaid from "mermaid"
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

mermaid.initialize({ startOnLoad: false })

const { mantenedores } = data

/* ── Estilos ─────────────────────────────────────────────────────── */
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

const homeMainClass = css({
  minHeight: "100vh",
  paddingTop: "12",
  paddingBottom: "8",
  maxWidth: "56rem",
  margin: "0 auto",
  paddingLeft: { base: "4", md: "8" },
  paddingRight: { base: "4", md: "8" },
})

const cardGridClass = css({
  display: "grid",
  gridTemplateColumns: { base: "1fr", md: "repeat(2, 1fr)" },
  gap: "6",
  marginTop: "8",
})

const cardClass = css({
  display: "flex",
  flexDirection: "column",
  gap: "3",
  padding: "6",
  bg: "base-100",
  borderWidth: "1px",
  borderColor: "base-300",
  borderRadius: "lg",
  transition: "box-shadow 0.2s, border-color 0.2s",
  _hover: {
    borderColor: "primary",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },
})

/* ── Tema ────────────────────────────────────────────────────────── */
function applyTheme(dark) {
  if (dark) document.documentElement.setAttribute("data-theme", "dark")
  else document.documentElement.removeAttribute("data-theme")
}

/* ── Sidebar ─────────────────────────────────────────────────────── */
function sidebarNav(currentMantenedor, onNavigate) {
  const current = m.route.get()

  const items = [
    m(MenuItem, {
      href: "#/",
      active: current === "/",
      onclick: () => { if (onNavigate) onNavigate() },
    }, "🏠 Inicio"),
  ]

  if (currentMantenedor) {
    items.push(m(MenuTitle, currentMantenedor.title))
    for (const section of currentMantenedor.sections) {
      items.push(m(MenuItem, {
        href: `#/${currentMantenedor.id}/${section.link}`,
        active: current === `/${currentMantenedor.id}/${section.link}`,
        onclick: () => { if (onNavigate) onNavigate() },
      }, section.text))
    }
  } else {
    items.push(m(MenuTitle, "Mantenedores"))
    for (const mnt of mantenedores) {
      const first = mnt.sections[0]?.link ?? ""
      items.push(m(MenuItem, {
        href: `#/${mnt.id}/${first}`,
        active: current.startsWith(`/${mnt.id}/`),
        onclick: () => { if (onNavigate) onNavigate() },
      }, mnt.title))
    }
  }

  return m(Menu, { size: "sm" }, items)
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

/* ── Componentes de página ───────────────────────────────────────── */

// Página de inicio: lista de mantenedores
const Home = {
  view: () =>
    m("main", { className: homeMainClass }, [
      m(Title, { as: "h1", size: "3", weight: "bold" }, "Manifiest"),
      m(Text, { as: "p", size: "md", color: "neutral", css: { marginTop: "2" } },
        "Documentación del modelo de datos"),
      mantenedores.length === 0
        ? m(Text, { as: "p", size: "sm", color: "neutral", css: { marginTop: "8" } },
            "No hay mantenedores disponibles.")
        : m("div", { className: cardGridClass },
            mantenedores.map((mnt) => {
              const firstSlug = mnt.sections[0]?.link ?? ""
              return m(Link, {
                href: `#/${mnt.id}/${firstSlug}`,
                css: { textDecoration: "none", color: "inherit" },
              },
                m("div", { className: cardClass }, [
                  m(Title, { as: "h2", size: "lg", weight: "semibold" }, mnt.title),
                  m("div", { className: metaClass }, [
                    m(Text, { as: "span", size: "sm", color: "neutral" }, [
                      "Por ",
                      mnt.author_link
                        ? m(Link, { href: mnt.author_link, target: "_blank", color: "primary" }, mnt.author)
                        : mnt.author,
                    ]),
                    mnt.date ? m(Text, { as: "span", size: "sm", color: "neutral" }, [" • ", mnt.date]) : null,
                  ]),
                  m(Text, { as: "span", size: "xs", color: "neutral", css: { marginTop: "2" } },
                    `${mnt.sections.length} secciones`),
                ]))
            })
          )
    ]),
}

// Cabecera de un mantenedor
function MantenedorHeader(mnt) {
  return {
    view: () =>
      m("header", [
        m(Title, { as: "h1", size: "2", weight: "bold" }, mnt.title),
        m("div", { className: metaClass }, [
          m(Text, { as: "span", size: "sm", color: "neutral" }, [
            "Por ",
            mnt.author_link
              ? m(Link, { href: mnt.author_link, color: "primary", target: "_blank" }, mnt.author)
              : mnt.author,
          ]),
          mnt.date ? m(Text, { as: "span", size: "sm", color: "neutral" }, [" • ", mnt.date]) : null,
        ]),
      ]),
  }
}

// Vista de una sección de un mantenedor
function SectionView() {
  const runMermaid = () => {
    mermaid.run({ querySelector: '#main-content .language-mermaid' })
  }
  return {
    oncreate: runMermaid,
    onupdate: runMermaid,
    view: ({ attrs }) => {
      const mnt = mantenedores.find((m) => m.id === attrs.mantenedor)
      if (!mnt) return m("main", { className: mainClass }, [
        m(Title, { as: "h1", size: "2", weight: "bold" }, "Mantenedor no encontrado"),
        m(Text, { as: "p", size: "sm", color: "neutral", css: { marginTop: "4" } },
          `No existe el mantenedor "${attrs.mantenedor}".`),
        m(Link, { href: "#/", css: { marginTop: "4", display: "inline-block" } }, "← Volver al inicio"),
      ])
      const section = mnt.sections.find((s) => s.link === attrs.slug) ?? mnt.sections[0]
      return m("main#main-content", { className: mainClass }, [
        m(MantenedorHeader(mnt)),
        m.trust(section?.html ?? ""),
      ])
    },
  }
}

/* ── Layout global ───────────────────────────────────────────────── */
const Layout = {
  oninit(vnode) {
    vnode.state.drawerOpen = false
    vnode.state.dark =
      document.documentElement.getAttribute("data-theme") === "dark"
  },
  view(vnode) {
    const state = vnode.state
    const closeDrawer = () => { state.drawerOpen = false }

    // Determinar el mantenedor activo (si estamos viendo una sección)
    const route = m.route.get()
    const parts = route.split("/").filter(Boolean)
    const currentMantenedor = parts.length >= 2
      ? mantenedores.find((m) => m.id === parts[0])
      : null

    return [
      m("div", { className: state.drawerOpen ? mobileBarHiddenClass : mobileBarClass }, [
        m(Navbar, { border: true, size: "sm", color: "base" }, [
          m(NavbarStart, [
            m(NavbarToggle, {
              open: state.drawerOpen,
              onclick: () => { state.drawerOpen = !state.drawerOpen },
            }),
            m(NavbarBrand, { href: "#/" }, "Manifiest"),
          ]),
          m(NavbarEnd, [themeToggle(state)]),
        ]),
      ]),
      m("aside", { className: sidebarClass }, [
        m("div", { className: sidebarGrowClass }, sidebarNav(currentMantenedor)),
        themeToggle(state),
      ]),
      m(Drawer, {
        open: state.drawerOpen,
        position: "start",
        size: "sm",
        labelledby: "nav-drawer-title",
        onclose: closeDrawer,
        onclosed: closeDrawer,
        onchange: (open) => { state.drawerOpen = open },
      }, [
        m(DrawerBox, [
          m(DrawerHeader, [m("h3", { id: "nav-drawer-title" }, "Manifiest")]),
          m(DrawerBody, [sidebarNav(currentMantenedor, closeDrawer)]),
        ]),
        m(DrawerBackdrop, { onclick: closeDrawer }),
      ]),
      vnode.children,
    ]
  },
}

/* ── Rutas ───────────────────────────────────────────────────────── */
m.route(document.getElementById("app"), "/", {
  "/": {
    render: () => m(Layout, m(Home)),
  },
  "/:mantenedor/:slug": {
    render: (vnode) => m(Layout, m(SectionView, vnode.attrs)),
  },
})
