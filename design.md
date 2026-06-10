# MMS Design System

> Maritime Meteorological System (MMS) — Centralized design reference for all pages and components.

---

## Table of Contents

1. [Brand Colors](#1-brand-colors)
2. [Status & Semantic Colors](#2-status--semantic-colors)
3. [Text Colors](#3-text-colors)
4. [Background Colors](#4-background-colors)
5. [Border Colors](#5-border-colors)
6. [Sidebar Colors](#6-sidebar-colors)
7. [Dashboard Glassmorphism (Dark Mode)](#7-dashboard-glassmorphism-dark-mode)
8. [Dashboard Light Theme Overrides](#8-dashboard-light-theme-overrides)
9. [Typography](#9-typography)
10. [Spacing Scale](#10-spacing-scale)
11. [Border Radius](#11-border-radius)
12. [Shadows](#12-shadows)
13. [Transitions](#13-transitions)
14. [Z-Index Scale](#14-z-index-scale)
15. [Components](#15-components)
16. [Page-Specific Styles](#16-page-specific-styles)
17. [Dark Mode Strategy](#17-dark-mode-strategy)
18. [Responsive Breakpoints](#18-responsive-breakpoints)
19. [Design Token Reference (CSS Variables)](#19-design-token-reference-css-variables)

---

## 1. Brand Colors

| Token                   | Hex       | Usage                                                |
| ----------------------- | --------- | ---------------------------------------------------- |
| `--color-primary`       | `#1a4999` | Primary buttons, active states, links, focus rings   |
| `--color-primary-dark`  | `#182168` | Headings, sidebar bg, navbar title, hover on primary |
| `--color-primary-hover` | `#153a7a` | Button hover state                                   |
| `--color-primary-light` | `#4658ac` | Secondary accent elements                            |
| `--color-primary-bg`    | `#dae8ff` | Active category bg, light primary backgrounds        |
| `--color-accent`        | `#8FC241` | Accent / highlight color                             |

### Color Hierarchy

```
Primary Dark   #182168  ████████████  Deepest — sidebar, headings
Primary        #1a4999  ████████████  Main brand — buttons, links, active
Primary Hover  #153a7a  ████████████  Hover states
Primary Light  #4658ac  ████████████  Secondary accent
Primary BG     #dae8ff  ████████████  Subtle backgrounds
Accent         #8FC241  ████████████  Green accent highlight
```

---

## 2. Status & Semantic Colors

| Token                      | Hex       | Usage                              |
| -------------------------- | --------- | ---------------------------------- |
| `--color-success`          | `#166534` | Active status text, success states |
| `--color-success-bg`       | `#dcfce7` | Active badge background            |
| `--color-danger`           | `#991b1b` | Inactive/error status text         |
| `--color-danger-bg`        | `#fee2e2` | Error badge background             |
| `--color-danger-btn`       | `#fb2c36` | Delete/danger button               |
| `--color-danger-btn-hover` | `#d9262e` | Delete button hover                |
| `--color-warning`          | `#ca8a04` | Warning text                       |
| `--color-warning-bg`       | `#fef9c3` | Warning badge background           |
| Notification badge         | `#fb2c36` | Unread notification dot            |

### Status Swatches

```
Success Text   #166534  ████████████  Active badges, confirmations
Success BG     #dcfce7  ████████████  Light green background
Danger Text    #991b1b  ████████████  Error badges, inactive status
Danger BG      #fee2e2  ████████████  Light red background
Danger Button  #fb2c36  ████████████  Delete / destructive actions
Warning Text   #ca8a04  ████████████  Caution states
Warning BG     #fef9c3  ████████████  Light yellow background
```

---

## 3. Text Colors

| Token                    | Hex       | Usage                                         |
| ------------------------ | --------- | --------------------------------------------- |
| `--color-text-primary`   | `#27272a` | Body text, table cells                        |
| `--color-text-heading`   | `#18181b` | Page headings, titles                         |
| `--color-text-secondary` | `#71717a` | Filter inputs, subtitles, chevrons            |
| `--color-text-muted`     | `#a1a1aa` | Table headers, pagination info, disabled text |
| `--color-text-link`      | `#1a4999` | Clickable links in tables                     |
| `--color-text-white`     | `#ffffff` | Sidebar text, primary buttons                 |

---

## 4. Background Colors

| Token                     | Hex       | Usage                      |
| ------------------------- | --------- | -------------------------- |
| `--color-bg-page`         | `#f9fbfc` | Page background            |
| `--color-bg-card`         | `#ffffff` | Cards, modals, table cards |
| `--color-bg-table-header` | `#f9fafb` | Table header rows          |
| `--color-bg-table-alt`    | `#f9fafb` | Zebra striping rows        |
| `--color-bg-input`        | `#ffffff` | Input backgrounds          |
| `--color-bg-disabled`     | `#d9d9d9` | Disabled state fill        |

---

## 5. Border Colors

| Token                   | Hex               | Usage                                 |
| ----------------------- | ----------------- | ------------------------------------- |
| `--color-border`        | `#e5e7eb`         | Table borders, card borders, dividers |
| `--color-border-light`  | `#f1f5f9`         | Light separators, table row bottom    |
| `--color-border-input`  | `#a3a3a9`         | Input focus borders                   |
| `--color-border-subtle` | `rgba(0,0,0,0.1)` | Filter inputs, subtle borders         |
| `--color-border-button` | `#d4d4d8`         | Pagination buttons, button outlines   |

---

## 6. Sidebar Colors

| Token                     | Hex / Value                                                                            | Usage                         |
| ------------------------- | -------------------------------------------------------------------------------------- | ----------------------------- |
| `--sidebar-bg`            | `#182168`                                                                              | Sidebar base background       |
| `--sidebar-gradient`      | `linear-gradient(180deg, #131c55 0%, rgba(19,28,85,0.35) 105%, rgba(19,28,85,0) 170%)` | Gradient overlay              |
| `--sidebar-active-bg`     | `#1a4999`                                                                              | Active nav link background    |
| `--sidebar-hover-bg`      | `rgba(255,255,255,0.05)`                                                               | Hover state background        |
| `--sidebar-submenu-hover` | `rgba(255,255,255,0.1)`                                                                | Submenu hover background      |
| Sidebar rail active       | `#5b6086`                                                                              | Left rail button active state |
| Logout hover              | `#f87171`                                                                              | Logout icon hover color       |

---

## 7. Dashboard Glassmorphism (Dark Mode)

The public-facing dashboard uses a glassmorphism design language with translucent surfaces and backdrop blur.

### Glass Surface Classes

| Class             | Background               | Border                   | Color              | Shadow                        |
| ----------------- | ------------------------ | ------------------------ | ------------------ | ----------------------------- |
| `.glass-surface`  | `rgba(255,255,255,0.08)` | `rgba(255,255,255,0.12)` | `rgb(241,245,249)` | `0 8px 32px rgba(0,0,0,0.28)` |
| `.glass-soft`     | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.1)`  | `rgb(226,232,240)` | `0 4px 24px rgba(0,0,0,0.2)`  |
| `.glass-inner`    | `rgba(255,255,255,0.04)` | `rgba(255,255,255,0.08)` | —                  | `0 2px 12px rgba(0,0,0,0.15)` |
| `.panel-card`     | `rgba(255,255,255,0.25)` | `rgba(255,255,255,0.6)`  | `rgb(226,232,240)` | `0 8px 32px rgba(0,0,0,0.2)`  |
| `.info-pill`      | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.12)` | `rgb(241,245,249)` | `0 2px 12px rgba(0,0,0,0.15)` |
| `.timeline-shell` | `rgba(255,255,255,0.25)` | `rgba(255,255,255,0.6)`  | —                  | `0 8px 32px rgba(0,0,0,0.2)`  |
| `.timeline-chip`  | `rgba(255,255,255,0.06)` | `rgba(255,255,255,0.12)` | —                  | —                             |
| `.mid-chevron`    | `rgba(255,255,255,0.1)`  | `rgba(255,255,255,0.18)` | `rgb(241,245,249)` | `0 4px 20px rgba(0,0,0,0.25)` |

**All glass elements share:** `backdrop-filter: blur(16px)` (panel-card uses `blur(20px) saturate(180%)`)

### Status Strip

| Property      | Value                              |
| ------------- | ---------------------------------- |
| Background    | `rgba(5,150,105,0.95)`             |
| Border bottom | `1px solid rgba(209,250,229,0.25)` |
| Text color    | `rgb(236,253,245)`                 |

### Map Vignette (Dark)

`linear-gradient(to bottom, rgba(2,6,23,0.32), rgba(2,6,23,0.08) 30%, rgba(2,6,23,0.5))`

### Search Input (Dark)

| State   | Border                  | Background               | Text               |
| ------- | ----------------------- | ------------------------ | ------------------ |
| Default | `rgba(16,185,129,0.45)` | `rgba(255,255,255,0.05)` | `rgb(248,250,252)` |
| Focus   | `rgba(16,185,129,0.7)`  | —                        | —                  |

### Knot Gradient

`linear-gradient(90deg, #14b8a6 0%, #84cc16 24%, #facc15 48%, #fb923c 72%, #d946ef 100%)`

---

## 8. Dashboard Light Theme Overrides

| Class             | Background               | Border                         | Text Color      |
| ----------------- | ------------------------ | ------------------------------ | --------------- |
| `.glass-surface`  | `rgba(255,255,255,0.7)`  | `rgba(255,255,255,0.5)`        | `rgb(30,41,59)` |
| `.glass-soft`     | `rgba(255,255,255,0.55)` | `rgba(255,255,255,0.4)`        | `rgb(51,65,85)` |
| `.glass-inner`    | `rgba(255,255,255,0.5)`  | `rgba(226,232,240,0.6)`        | —               |
| `.panel-card`     | `rgba(255,255,255,0.25)` | `rgba(255,255,255,0.6)`        | `rgb(51,65,85)` |
| `.info-pill`      | `rgba(255,255,255,0.5)`  | `rgba(255,255,255,0.4)`        | `rgb(51,65,85)` |
| `.metric-card`    | `rgba(255,255,255,0.65)` | `rgba(255,255,255,0.45)`       | `rgb(30,41,59)` |
| `.timeline-shell` | `rgba(255,255,255,0.25)` | `rgba(255,255,255,0.6)`        | —               |
| `.timeline-chip`  | `rgba(255,255,255,0.5)`  | `rgba(226,232,240,0.7)`        | `rgb(51,65,85)` |
| `.tab-active`     | `rgba(255,255,255,0.6)`  | bottom: `rgba(59,130,246,0.6)` | `rgb(15,23,42)` |

---

## 9. Typography

### Font Family

**Primary:** `Inter` (loaded via Google Fonts, `<link>` in HTML head)

### Font Size Scale

| Token              | Size   | Usage                                |
| ------------------ | ------ | ------------------------------------ |
| `--font-size-xs`   | `10px` | Data layer labels, tiny text         |
| `--font-size-sm`   | `12px` | Badges, subtitles, secondary labels  |
| `--font-size-base` | `14px` | Body text, table cells, inputs       |
| `--font-size-md`   | `16px` | Sidebar links, table headers, titles |
| `--font-size-lg`   | `18px` | Sidebar icons, larger labels         |
| `--font-size-xl`   | `20px` | Month headers, section titles        |
| `--font-size-2xl`  | `24px` | Page headings                        |
| `--font-size-3xl`  | `36px` | Hero numbers, key metrics            |

### Font Weights

| Weight     | Value | Usage                             |
| ---------- | ----- | --------------------------------- |
| Regular    | `400` | Body text                         |
| Medium     | `500` | Links, filter inputs, subtitles   |
| Semi-Bold  | `600` | Active nav, table headers, labels |
| Bold       | `700` | Headings, titles, username        |
| Extra-Bold | `800` | Data group summaries              |

### Line Height

Default: `1.5` (set on `body`)

### Letter Spacing

| Context           | Value     |
| ----------------- | --------- |
| Login tracking    | `0.3em`   |
| Navbar title      | `-0.45px` |
| Navbar subtitle   | `-0.15px` |
| Timeline day chip | `-0.01em` |

---

## 10. Spacing Scale

| Token         | Value  | Usage                             |
| ------------- | ------ | --------------------------------- |
| `--space-xs`  | `4px`  | Tight gaps                        |
| `--space-sm`  | `8px`  | Icon gaps, padding                |
| `--space-md`  | `12px` | Nav gaps, table cell padding      |
| `--space-lg`  | `16px` | Standard padding                  |
| `--space-xl`  | `20px` | Section padding                   |
| `--space-2xl` | `24px` | Card padding, section gaps        |
| `--space-3xl` | `32px` | Logo padding, modal action margin |
| `--space-4xl` | `48px` | Large sections                    |

### Page-Level Spacing

| Token                     | Value  | Usage                             |
| ------------------------- | ------ | --------------------------------- |
| `--page-padding-x`        | `32px` | Horizontal page padding (desktop) |
| `--page-padding-x-mobile` | `16px` | Horizontal page padding (mobile)  |
| `--page-padding-y`        | `21px` | Vertical page padding             |
| `--section-gap`           | `24px` | Between sections                  |

---

## 11. Border Radius

| Token                   | Value    | Usage                                 |
| ----------------------- | -------- | ------------------------------------- |
| `--radius-sm`           | `8px`    | Small elements, pagination buttons    |
| `--radius-md`           | `10px`   | Badges, filter selects, sidebar items |
| `--radius-lg`           | `12px`   | Standard containers, dropdowns        |
| `--radius-xl`           | `14px`   | Filter inputs, large dropdowns        |
| `--radius-2xl`          | `16px`   | Cards, timeline cards                 |
| `--radius-card`         | `21px`   | Modal content, table cards            |
| `--radius-full`         | `9999px` | Pills, avatars, notification dots     |
| `--radius-sidebar-item` | `8px`    | Sidebar navigation items              |

---

## 12. Shadows

| Token                   | Value                                                            | Usage                                |
| ----------------------- | ---------------------------------------------------------------- | ------------------------------------ |
| `--shadow-card`         | `0 1px 2px 0 rgba(0,0,0,0.05)`                                   | Cards, table wrappers                |
| `--shadow-dropdown`     | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | Dropdowns, selects                   |
| `--shadow-modal`        | `0 25px 50px -12px rgba(0,0,0,0.25)`                             | Modal dialogs                        |
| Glass shadow (Tailwind) | `0 14px 36px rgba(2,6,23,0.24)`                                  | `boxShadow.glass` in Tailwind config |
| Navbar                  | `0 10px 24px rgba(15,23,42,0.14)`                                | Navbar bar shadow                    |
| Data layers panel       | `0 20px 46px rgba(15,23,42,0.18)`                                | Left panel shadow                    |

---

## 13. Transitions

| Token                  | Value                               | Usage                       |
| ---------------------- | ----------------------------------- | --------------------------- |
| `--transition-fast`    | `150ms ease`                        | Hover states, color changes |
| `--transition-base`    | `200ms ease`                        | Standard transitions        |
| `--transition-slow`    | `300ms ease`                        | Sidebar, accordions         |
| `--transition-sidebar` | `300ms ease-in-out`                 | Sidebar slide               |
| Panel slide            | `320ms cubic-bezier(0.2,0.9,0.2,1)` | Data layers panel           |
| Bottom collapse        | `420ms cubic-bezier(0.2,0.9,0.2,1)` | Bottom panel collapse       |
| Layers panel           | `420ms cubic-bezier(0.2,0.9,0.2,1)` | Right layers panel slide    |
| Dropdown open          | `200ms cubic-bezier(0.4,0,0.2,1)`   | Select/multiselect open     |
| Card hover lift        | `250ms cubic-bezier(0.4,0,0.2,1)`   | Catalog card hover          |

---

## 14. Z-Index Scale

| Token                  | Value    | Usage                       |
| ---------------------- | -------- | --------------------------- |
| `--z-header`           | `30`     | Mobile header               |
| `--z-sidebar-backdrop` | `40`     | Sidebar backdrop overlay    |
| `--z-sidebar`          | `50`     | Sidebar navigation          |
| `--z-modal`            | `100`    | Modal dialogs               |
| `--z-tooltip`          | `110`    | Tooltips, popovers          |
| Catalog overlay        | `10000`  | Compass dropdown on mobile  |
| Flatpickr              | `999999` | Date picker (always on top) |

---

## 15. Components

### 15.1 Buttons

| Type              | Background | Text      | Border                            | Radius             |
| ----------------- | ---------- | --------- | --------------------------------- | ------------------ |
| **Primary**       | `#1a4999`  | `#ffffff` | none                              | `var(--radius-md)` |
| **Primary Hover** | `#153a7a`  | `#ffffff` | none                              | —                  |
| **Danger**        | `#fb2c36`  | `#ffffff` | none                              | `var(--radius-md)` |
| **Danger Hover**  | `#d9262e`  | `#ffffff` | none                              | —                  |
| **Outline**       | `#ffffff`  | `#27272a` | `1px solid #d4d4d8`               | `var(--radius-md)` |
| **Outline Hover** | `#f4f4f5`  | `#27272a` | `1px solid #d4d4d8`               | —                  |
| **Navbar menu**   | `#1a4999`  | `#ffffff` | `1px solid rgba(255,255,255,0.2)` | `14px`             |
| **Timeline play** | `#182168`  | `#ffffff` | `1px solid #182168`               | `8px`              |

### 15.2 Status Badges

| Variant        | Background | Text      | Dot Color |
| -------------- | ---------- | --------- | --------- |
| Active (green) | `#dcfce7`  | `#166534` | `#166534` |
| Inactive (red) | `#fee2e2`  | `#991b1b` | `#991b1b` |

**Structure:** `display: inline-flex; gap: 6px; padding: 4px 10px; font-size: 12px; font-weight: 500;`
**Dot size:** 8px circle (9px for `--lg` variant)
**Pill variant:** `border-radius: 9999px; padding: 4px 12px;`

### 15.3 Filter Inputs

| Property     | Value                              |
| ------------ | ---------------------------------- |
| Border       | `1.3px solid rgba(0,0,0,0.1)`      |
| Radius       | `14px` (input) / `10px` (select)   |
| Padding      | `10px 19px`                        |
| Font size    | `14px`                             |
| Text color   | `#71717a`                          |
| Focus border | `#1a4999`                          |
| Width        | `300px` (input) / `170px` (select) |

### 15.4 Data Tables

| Element            | Background | Text Color | Font Size | Font Weight       |
| ------------------ | ---------- | ---------- | --------- | ----------------- |
| Header             | `#f9fafb`  | `#a1a1aa`  | `16px`    | `700`             |
| Body row           | `#ffffff`  | `#27272a`  | `14px`    | `400`             |
| Alt row            | `#f9fafb`  | —          | —         | —                 |
| Link               | —          | `#1a4999`  | —         | `500` (underline) |
| Pagination current | `#1a4999`  | `#ffffff`  | `14px`    | —                 |
| Pagination hover   | `#f4f4f5`  | `#27272a`  | —         | —                 |

**Cell padding:** `12px 32px`
**Table card:** `border: 1px solid #e5e7eb; border-radius: 21px; box-shadow: 0 1px 2px rgba(0,0,0,0.05)`

### 15.5 Global Select (Single)

| Property     | Light                 | Dark                    |
| ------------ | --------------------- | ----------------------- |
| Background   | `#ffffff`             | `#1e293b`               |
| Border       | `rgba(0,0,0,0.1)`     | `rgba(255,255,255,0.1)` |
| Text         | `#18181b`             | `#f8fafc`               |
| Placeholder  | `#71717a`             | `#94a3b8`               |
| Hover border | `#131C55`             | `#4f46e5`               |
| Selected bg  | `rgba(19,28,85,0.08)` | `rgba(79,70,229,0.15)`  |
| Panel bg     | `#ffffff`             | `#1e293b`               |

**Trigger:** height 41px, border-radius 12px, font-size 14px
**Dropdown:** border-radius 14px, opens with `translateY(-8px) scale(0.98)` → `translateY(0) scale(1)`
**Focus ring:** `0 0 0 3px rgba(19,28,85,0.15)` (light) / `0 0 0 3px rgba(56,189,248,0.2)` (dark)

### 15.6 Global Multi-Select

Same foundation as Single Select with additions:

| Property      | Value                                                          |
| ------------- | -------------------------------------------------------------- |
| Chip bg       | `rgba(19,28,85,0.08)` (light) / `rgba(56,189,248,0.15)` (dark) |
| Chip text     | `#131C55` (light) / `#38bdf8` (dark)                           |
| Chip border   | `rgba(19,28,85,0.15)` (light) / `rgba(56,189,248,0.25)` (dark) |
| Checkbox size | `18px`, border-radius `5px`                                    |
| Footer        | Sticky bottom with Clear / Apply buttons                       |
| Mobile        | Bottom sheet (fixed, slides up), border-radius `20px 20px 0 0` |

### 15.7 Modals

| Property        | Value                                           |
| --------------- | ----------------------------------------------- |
| Backdrop        | `rgba(0,0,0,0.6)`, `backdrop-filter: blur(4px)` |
| Content bg      | `#ffffff`                                       |
| Content radius  | `21px`                                          |
| Content padding | `24px` (mobile) / `32px 49px` (desktop)         |
| Max width       | `772px`                                         |
| Shadow          | `0 25px 50px -12px rgba(0,0,0,0.25)`            |
| Entry animation | `scale(0.95)` → `scale(1)`, opacity `0` → `1`   |
| Icon (danger)   | bg `#fef2f2`, icon color `#ef4444`, size `40px` |

### 15.8 Custom Checkbox

| Property         | Value                                            |
| ---------------- | ------------------------------------------------ |
| Size             | `16px x 16px`                                    |
| Border radius    | `4px`                                            |
| Unchecked bg     | `#f3f3f5`                                        |
| Unchecked border | `1px solid rgba(0,0,0,0.1)`                      |
| Checked bg       | `#1a4999`                                        |
| Checked border   | `#1a4999`                                        |
| Checkmark        | White `border-width: 0 2px 2px 0`, rotated 45deg |
| Shadow           | `0 1px 2px rgba(0,0,0,0.05)`                     |

### 15.9 Notification Dropdown

| Element          | Background                       | Text      |
| ---------------- | -------------------------------- | --------- |
| Tab active       | `#182168`                        | `#ffffff` |
| Tab hover        | `#f1f5f9`                        | `#182168` |
| Unread item      | `#f8f9ff`                        | —         |
| Unread hover     | `#eef1fd`                        | —         |
| Bell active      | `#1a4999`                        | —         |
| Bell active ring | `0 0 0 3px rgba(24,33,104,0.25)` | —         |

---

## 16. Page-Specific Styles

### 16.1 Login Page

| Property       | Value                                                                                                                   |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| Background     | `linear-gradient(8.5deg, rgba(24,33,104,0.063) 0%, rgba(255,255,255,0) 100%), linear-gradient(90deg, #FFFFFF, #FFFFFF)` |
| Logo           | BMKG white logo, `height: 56px`                                                                                         |
| Letter spacing | `0.3em` for login label                                                                                                 |

### 16.2 Dashboard (Public)

| Property                   | Value                                                              |
| -------------------------- | ------------------------------------------------------------------ |
| Left rail width            | `62px`                                                             |
| Left panel width           | `360px` (max)                                                      |
| Navbar height              | `69px` (desktop), `64px` (mobile)                                  |
| Navbar bar                 | bg `#fff`, radius `10px`, shadow `0 10px 24px rgba(15,23,42,0.14)` |
| Navbar search              | bg `#f1f1f1`, radius `20px`, width `274px`                         |
| Data group summary         | bg `#1a4999`, color `#fff`, radius `15px`, height `30px`           |
| Data group card            | border `#1a4999`, bg `#fbfbfb`, radius `0 0 15px 15px`             |
| Catalog tab active         | bg `#1A4999`, color `#fff`                                         |
| Layer detail variable name | color `#101828`, size `10px`                                       |
| "Add to map" pill          | bg `#c2c2c6` → hover `#a0a0a8`, added state `#ef4444`              |

### 16.3 View Audit (Timeline)

| Element                    | Background | Border                 | Text Color | Font Size         |
| -------------------------- | ---------- | ---------------------- | ---------- | ----------------- |
| Month header               | —          | —                      | `#18181b`  | `20px`, bold      |
| Date header                | —          | —                      | `#27272a`  | `15px`, semi-bold |
| Date dot                   | `#2563eb`  | —                      | —          | `8px` circle      |
| Timeline icon (blue)       | `#eff6ff`  | `#bfdbfe`              | `#1d4ed8`  | —                 |
| Timeline icon (green)      | `#f0fdf4`  | `#bbf7d0`              | `#15803d`  | —                 |
| Timeline icon (red)        | `#fef2f2`  | `#fecaca`              | `#b91c1c`  | —                 |
| Timeline card              | `#ffffff`  | `1.3px solid #e5e7eb`  | —          | —                 |
| Timeline card hover shadow | —          | `#d1d5db`              | —          | —                 |
| Empty state                | `#ffffff`  | `1.3px dashed #cbd5e1` | —          | —                 |

**Timeline connector line:** `2px solid #e2e8f0`
**Timeline icon box:** `38px` circle, `2px solid #e2e8f0`

### 16.4 New Role / View Role Management

| Element                      | Property | Value                                                  |
| ---------------------------- | -------- | ------------------------------------------------------ |
| Category nav                 | Mobile   | Horizontal scroll, bottom border indicator             |
| Category nav                 | Desktop  | Vertical sidebar, `297px` width, left border indicator |
| Category btn active          | Mobile   | `color: #1a4999; border-bottom: #71717a`               |
| Category btn active          | Desktop  | `bg: #dae8ff; border-left: 3px solid #1a4999`          |
| Permission table header      | bg       | `#f9fafb`                                              |
| Permission table header text | color    | `#4a5565`, `13px` mobile / `14px` desktop              |
| Permission table cell text   | color    | `#101828`, `13px` mobile / `14px` desktop              |
| Permission table border      | —        | `1px solid #e5e7eb`                                    |
| Alt row                      | bg       | `rgba(249,250,251,0.5)`                                |

---

## 17. Dark Mode Strategy

The project supports two dark mode approaches:

### Admin Pages (CSS class-based)

- Toggle class `dark` on `<html>` element
- Theme persisted in `localStorage.getItem("theme")`
- Default: `"light"`
- Managed by `theme.js` (runs in `<head>` to prevent FOUC)

### Dashboard (Light theme class)

- Light theme activated by `.light-theme` class on parent
- Dashboard default is dark; `.light-theme` overrides glassmorphism values

### Dark Mode Variable Overrides (Select / Multi-Select)

| Token                    | Light             | Dark                    |
| ------------------------ | ----------------- | ----------------------- |
| `--select-bg`            | `#ffffff`         | `#1e293b`               |
| `--select-border`        | `rgba(0,0,0,0.1)` | `rgba(255,255,255,0.1)` |
| `--select-text`          | `#18181b`         | `#f8fafc`               |
| `--select-text-muted`    | `#71717a`         | `#94a3b8`               |
| `--select-hover-bg`      | `#f4f4f5`         | `#334155`               |
| `--select-active-border` | `#131C55`         | `#4f46e5`               |
| `--select-primary`       | `#131C55`         | `#38bdf8`               |
| `--ms-primary`           | `#131C55`         | `#4f46e5`               |
| `--ms-chip-text`         | `#131C55`         | `#38bdf8`               |

---

## 18. Responsive Breakpoints

| Breakpoint     | Width      | Usage                                             |
| -------------- | ---------- | ------------------------------------------------- |
| Mobile         | `≤ 639px`  | Stacked layouts, bottom sheets, full-width panels |
| Tablet         | `≤ 767px`  | Horizontal nav, compact sidebar                   |
| Small desktop  | `≥ 768px`  | Sidebar visible, vertical category nav            |
| Medium desktop | `≥ 1024px` | Full layout, scroll hints hidden                  |
| Large desktop  | Default    | Max-width containers                              |

### Key Responsive Rules

- **Sidebar:** Hidden on mobile (`display: none`), visible on `≥ 768px`
- **Mobile header:** Visible only on `≤ 767px`
- **Data layers panel:** Full-screen on `≤ 639px`, floating panel on larger
- **Multi-select dropdown:** Bottom sheet on `≤ 768px`, floating dropdown on larger
- **Permission nav:** Horizontal scroll on mobile, vertical sidebar on `≥ 768px`

---

## 19. Design Token Reference (CSS Variables)

All tokens are defined in `assets/css/global/variables.css` under `:root {}`. Reference them in CSS as `var(--token-name)`.

### Quick Reference — Most Used Tokens

```
/* Colors */
--color-primary: #1a4999;
--color-primary-dark: #182168;
--color-primary-bg: #dae8ff;

/* Text */
--color-text-primary: #27272a;
--color-text-secondary: #71717a;
--color-text-muted: #a1a1aa;

/* Backgrounds */
--color-bg-page: #f9fbfc;
--color-bg-card: #ffffff;

/* Borders */
--color-border: #e5e7eb;
--color-border-light: #f1f5f9;

/* Spacing */
--space-sm: 8px;
--space-lg: 16px;
--space-2xl: 24px;

/* Radius */
--radius-md: 10px;
--radius-card: 21px;
--radius-full: 9999px;

/* Typography */
--font-family: 'Inter', sans-serif;
--font-size-base: 14px;
--font-size-md: 16px;

/* Shadows */
--shadow-card: 0 1px 2px 0 rgba(0,0,0,0.05);
--shadow-modal: 0 25px 50px -12px rgba(0,0,0,0.25);

/* Z-index */
--z-modal: 100;
--z-sidebar: 50;
```
