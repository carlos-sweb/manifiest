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
import { Button } from "panda-ui-mithril/button"
import { ThemeController } from "panda-ui-mithril/theme-controller"
import { Tabs, Tab, TabContent } from "panda-ui-mithril/tabs"

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

const mainWithTocClass = css({
  minHeight: "100vh",
  paddingTop: "8",
  paddingBottom: "8",
  maxWidth: "56rem",
  marginLeft: { base: "0", md: "16rem" },
  marginRight: { base: "0", lg: "15rem" },
  paddingLeft: { base: "4", md: "12" },
  paddingRight: { base: "4", md: "8" },
})

const tocRailClass = css({
  display: { base: "none", lg: "flex" },
  flexDirection: "column",
  position: "fixed",
  top: "0",
  right: "0",
  width: "15rem",
  height: "100vh",
  overflowY: "auto",
  padding: "4",
  gap: "2",
  bg: "base-100",
  borderLeftWidth: "1px",
  borderLeftColor: "base-300",
  zIndex: "10",
})

const tocTitleClass = css({
  fontSize: "xs",
  fontWeight: "semibold",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  color: "neutral",
  marginBottom: "2",
})

const tocLinkClass = css({
  display: "block",
  fontSize: "sm",
  lineHeight: "1.35",
  color: "base-content",
  textDecoration: "none",
  paddingY: "1",
  paddingX: "2",
  borderRadius: "md",
  borderLeftWidth: "2px",
  borderLeftColor: "transparent",
  _hover: {
    bg: "base-200",
  },
})

const tocLinkActiveClass = css({
  display: "block",
  fontSize: "sm",
  lineHeight: "1.35",
  color: "primary",
  fontWeight: "medium",
  textDecoration: "none",
  paddingY: "1",
  paddingX: "2",
  borderRadius: "md",
  borderLeftWidth: "2px",
  borderLeftColor: "primary",
  bg: "base-200",
})

const tocChildLinkClass = css({
  display: "block",
  fontSize: "xs",
  lineHeight: "1.35",
  color: "base-content",
  textDecoration: "none",
  paddingY: "1",
  paddingLeft: "4",
  paddingRight: "2",
  borderRadius: "md",
  borderLeftWidth: "2px",
  borderLeftColor: "transparent",
  opacity: "0.85",
  _hover: {
    bg: "base-200",
    opacity: "1",
  },
})

const tocChildLinkActiveClass = css({
  display: "block",
  fontSize: "xs",
  lineHeight: "1.35",
  color: "primary",
  fontWeight: "medium",
  textDecoration: "none",
  paddingY: "1",
  paddingLeft: "4",
  paddingRight: "2",
  borderRadius: "md",
  borderLeftWidth: "2px",
  borderLeftColor: "primary",
  bg: "base-200",
  opacity: "1",
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

const pagerNavClass = css({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "4",
  marginTop: "12",
  paddingTop: "6",
  borderTopWidth: "1px",
  borderTopColor: "base-300",
})

const pagerSlotClass = css({
  display: "flex",
  flex: "1",
  minWidth: "0",
})

const pagerSlotEndClass = css({
  display: "flex",
  flex: "1",
  minWidth: "0",
  justifyContent: "flex-end",
})

function scrollToTop() {
  window.scrollTo(0, 0)
}

function slugify(text) {
  return String(text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    || "section"
}

/**
 * Inyecta ids y arma TOC jerárquico:
 * - h3/h4 → ítems principales
 * - `<p><strong>…</strong></p>` → submenu del h3/h4 anterior
 */
function prepareSectionHtml(html) {
  const doc = new DOMParser().parseFromString(`<div id="__root">${html}</div>`, "text/html")
  const root = doc.getElementById("__root")
  if (!root) return { html, toc: [] }

  const used = new Set()
  const toc = []
  let current = null

  const uniqueId = (base) => {
    let id = base || "section"
    let n = 2
    while (used.has(id)) {
      id = `${base}-${n++}`
    }
    used.add(id)
    return id
  }

  const isBoldOnlyParagraph = (el) => {
    if (el.tagName !== "P") return false
    const kids = [...el.childNodes].filter(
      (n) => !(n.nodeType === Node.TEXT_NODE && !(n.textContent || "").trim())
    )
    return (
      kids.length === 1 &&
      kids[0].nodeType === Node.ELEMENT_NODE &&
      kids[0].tagName === "STRONG"
    )
  }

  // Drop markdown-generated ids so our slugify owns the namespace (accents, etc.).
  for (const el of root.querySelectorAll("h3[id], h4[id]")) {
    el.removeAttribute("id")
  }

  for (const el of root.querySelectorAll("h3, h4, p")) {
    if (el.tagName === "H3" || el.tagName === "H4") {
      const text = (el.textContent || "").trim()
      if (!text) continue
      const id = uniqueId(slugify(text))
      el.setAttribute("id", id)
      el.style.scrollMarginTop = "4.5rem"
      current = { id, text, children: [] }
      toc.push(current)
      continue
    }

    if (!isBoldOnlyParagraph(el)) continue
    const text = (el.querySelector("strong")?.textContent || "").trim()
    if (!text) continue
    const id = uniqueId(slugify(text))
    el.setAttribute("id", id)
    el.style.scrollMarginTop = "4.5rem"

    const child = { id, text }
    if (current) current.children.push(child)
    else toc.push({ id, text, children: [] })
  }

  return { html: root.innerHTML, toc }
}

function scrollToTocId(id, behavior = "smooth") {
  if (!id) return false
  const el = document.getElementById(id)
  if (!el) return false
  el.scrollIntoView({ behavior, block: "start" })
  return true
}

function tocItemLink(item, mntId, sectionLink, activeId, child = false) {
  return m("a", {
    href: `#/${mntId}/${sectionLink}?toc=${encodeURIComponent(item.id)}`,
    className: child
      ? (item.id === activeId ? tocChildLinkActiveClass : tocChildLinkClass)
      : (item.id === activeId ? tocLinkActiveClass : tocLinkClass),
    onclick: (e) => {
      e.preventDefault()
      scrollToTocId(item.id, "smooth")
      m.route.set(`/${mntId}/${sectionLink}`, { toc: item.id }, { replace: true })
    },
  }, item.text)
}

function flattenTocIds(toc) {
  const ids = []
  for (const item of toc) {
    ids.push(item)
    if (item.children?.length) {
      for (const child of item.children) ids.push(child)
    }
  }
  return ids
}

function tocRail(toc, mntId, sectionLink, activeId) {
  if (!toc.length) return null
  const links = []
  for (const item of toc) {
    links.push(tocItemLink(item, mntId, sectionLink, activeId, false))
    if (item.children?.length) {
      for (const child of item.children) {
        links.push(tocItemLink(child, mntId, sectionLink, activeId, true))
      }
    }
  }
  return m("aside", { className: tocRailClass, "aria-label": "En esta página" }, [
    m("div", { className: tocTitleClass }, "En esta página"),
    ...links,
  ])
}

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
    }, "Inicio"),
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
  oncreate: scrollToTop,
  onupdate: scrollToTop,
  view: () =>
    m("main", { className: homeMainClass }, [
      m(Title, { as: "h1", size: "3", weight: "bold" }, "Manifiesto"),
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

function sectionPager(mnt, section) {
  const idx = mnt.sections.findIndex((s) => s.link === section.link)
  const prev = idx > 0 ? mnt.sections[idx - 1] : null
  const next = idx >= 0 && idx < mnt.sections.length - 1 ? mnt.sections[idx + 1] : null

  return m("nav", { className: pagerNavClass, "aria-label": "Navegación de secciones" }, [
    m("div", { className: pagerSlotClass },
      prev
        ? m(Button, {
            href: `#/${mnt.id}/${prev.link}`,
            variant: "outline",
            color: "neutral",
            size: "sm",
          }, ["← ", prev.text])
        : null
    ),
    m("div", { className: pagerSlotEndClass },
      next
        ? m(Button, {
            href: `#/${mnt.id}/${next.link}`,
            variant: "outline",
            color: "primary",
            size: "sm",
          }, [next.text, " →"])
        : null
    ),
  ])
}

// Cabecera de un mantenedor
function MantenedorHeader(mnt, section) {
  return {
    view: () =>
      m("header", [
        m(Title, { as: "h1", size: "2", weight: "bold" }, section?.text || mnt.title),        
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

// Procesa HTML con marcadores <!-- tab:ETIQUETA --> y devuelve segmentos
// que alternan entre HTML normal y grupos de tabs.
function parseTabGroups(html) {
  // Separar por <!-- tab:... --> (el marcador inicia un nuevo bloque)
  const TAB_MARKER = /<!--\s*tab:/
  const parts = html.split(TAB_MARKER)

  const segments = []
  // El primer elemento es HTML antes del primer <!-- tab:
  if (parts[0].trim()) {
    segments.push({ type: "html", content: parts[0] })
  }

  let currentTabs = []
  for (let i = 1; i < parts.length; i++) {
    // parts[i] empieza con: ETIQUETA -->\n...contenido...
    const closeIdx = parts[i].indexOf("-->")
    if (closeIdx === -1) {
      // Marcador mal formado: tratar como HTML
      segments.push({ type: "html", content: "<!-- tab:" + parts[i] })
      continue
    }
    const label = parts[i].substring(0, closeIdx).trim()
    let content = parts[i].substring(closeIdx + 3)

    // El contenido termina donde empieza el próximo <!-- tab: o fin
    // (ya lo cortó el split, así que content es solo de este bloque)

    currentTabs.push({ label, content })
  }

  if (currentTabs.length > 0) {
    segments.push({ type: "tabs", tabs: currentTabs })
  }

  return segments
}

// Vista de una sección de un mantenedor
function SectionView() {
  let lastKey = ""
  let lastTocParam = ""
  let activeId = ""
  let latestToc = []
  let observer = null

  const runMermaid = () => {
    mermaid.run({ querySelector: "#main-content .language-mermaid" })
  }

  const teardownObserver = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
  }

  const setupObserver = () => {
    teardownObserver()
    const flat = flattenTocIds(latestToc)
    if (!flat.length || typeof IntersectionObserver === "undefined") return
    observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (!visible.length) return
        const next = visible[0].target.id
        if (next && next !== activeId) {
          activeId = next
          m.redraw()
        }
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: [0, 1] }
    )
    for (const item of flat) {
      const el = document.getElementById(item.id)
      if (el) observer.observe(el)
    }
  }

  const syncRoute = () => {
    const key = `${m.route.param("mantenedor")}/${m.route.param("slug")}`
    const tocParam = m.route.param("toc") || ""
    const pageChanged = key !== lastKey
    const tocChanged = tocParam !== lastTocParam

    if (pageChanged) {
      lastKey = key
      lastTocParam = tocParam
      activeId = tocParam
      teardownObserver()
      if (tocParam) {
        requestAnimationFrame(() => {
          if (!scrollToTocId(tocParam, "auto")) scrollToTop()
          setupObserver()
        })
      } else {
        scrollToTop()
        requestAnimationFrame(() => setupObserver())
      }
    } else if (tocChanged) {
      lastTocParam = tocParam
      activeId = tocParam
      if (tocParam) scrollToTocId(tocParam, "smooth")
    } else {
      // Re-bind observer after redraws that replace trusted HTML.
      requestAnimationFrame(() => {
        if (!observer) setupObserver()
      })
    }

    runMermaid()
  }

  return {
    oncreate: syncRoute,
    onupdate: syncRoute,
    onremove: teardownObserver,
    view: ({ attrs }) => {
      const mnt = mantenedores.find((m) => m.id === attrs.mantenedor)
      if (!mnt) return m("main", { className: mainClass }, [
        m(Title, { as: "h1", size: "2", weight: "bold" }, "Mantenedor no encontrado"),
        m(Text, { as: "p", size: "sm", color: "neutral", css: { marginTop: "4" } },
          `No existe el mantenedor "${attrs.mantenedor}".`),
        m(Link, { href: "#/", css: { marginTop: "4", display: "inline-block" } }, "← Volver al inicio"),
      ])

      const section = mnt.sections.find((s) => s.link === attrs.slug) ?? mnt.sections[0]
      const prepared = prepareSectionHtml(section?.html ?? "")
      latestToc = prepared.toc

      const segments = parseTabGroups(prepared.html)
      const children = segments.map((seg, i) => {
        if (seg.type === "html") return m.trust(seg.content)
        if (seg.type === "tabs") {
          return m(Tabs, { key: i, boxed: true, defaultActive: seg.tabs[0].label }, [
            seg.tabs.map((t) => m(Tab, { key: t.label, ref: t.label }, t.label)),
            seg.tabs.map((t) => m(TabContent, { key: "tc-" + t.label, ref: t.label }, m.trust(t.content))),
          ])
        }
      })

      const currentToc = m.route.param("toc") || activeId
      const hasToc = prepared.toc.length > 0

      return [
        m("main#main-content", { className: hasToc ? mainWithTocClass : mainClass }, [
          m(MantenedorHeader(mnt, section)),
          children,
          sectionPager(mnt, section),
        ]),
        tocRail(prepared.toc, mnt.id, section.link, currentToc),
      ]
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
    const route = (m.route.get() || "").split("?")[0]
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
            m(NavbarBrand, { href: "#/" }, "Manifiesto"),
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
          m(DrawerHeader, [m("h3", { id: "nav-drawer-title" }, "Manifiesto")]),
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
