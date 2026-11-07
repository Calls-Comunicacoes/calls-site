import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = (p: P) => ({
  width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const,
  'aria-hidden': true, ...p,
})

export const IconWindows = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="M3 5.1 10.4 4v7.2H3zM11.4 3.9 21 2.5v8.7h-9.6zM3 12.2h7.4v7.2L3 18.3zM11.4 12.2H21v8.7l-9.6-1.4z" />
  </svg>
)
export const IconLock = (p: P) => (
  <svg {...base(p)}><rect x="4.5" y="10.5" width="15" height="10" rx="1.5" /><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.3" /></svg>
)
export const IconScreen = (p: P) => (
  <svg {...base(p)}><rect x="3" y="4" width="18" height="12.5" rx="1.5" /><path d="M8.5 20.5h7M12 16.5v4" /><path d="M10 8.5l4 1.8-4 1.8z" fill="currentColor" /></svg>
)
export const IconRoles = (p: P) => (
  <svg {...base(p)}><path d="M12 3l7.5 3v5.5c0 4.5-3.2 8-7.5 9.5-4.3-1.5-7.5-5-7.5-9.5V6z" /><path d="M9 12l2.2 2.2L15.5 10" /></svg>
)
export const IconInvite = (p: P) => (
  <svg {...base(p)}><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" /><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" /><path d="M18.5 16.5v4M16.5 18.5h4" /></svg>
)
export const IconSound = (p: P) => (
  <svg {...base(p)}><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" /><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" /></svg>
)
export const IconTag = (p: P) => (
  <svg {...base(p)}><path d="M9 3.5 7 20.5M17 3.5l-2 17M4 8.5h16.5M3.5 15.5H20" /></svg>
)
export const IconCheck = (p: P) => (
  <svg {...base(p)} strokeWidth={2.2}><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
)
export const IconArrow = (p: P) => (
  <svg {...base(p)}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const IconMic = (p: P) => (
  <svg {...base(p)}><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21" /></svg>
)
export const IconHeadset = (p: P) => (
  <svg {...base(p)}><path d="M4 14v-2a8 8 0 0 1 16 0v2" /><rect x="3.5" y="13.5" width="4" height="6.5" rx="1.2" /><rect x="16.5" y="13.5" width="4" height="6.5" rx="1.2" /></svg>
)
export const IconPhoneOff = (p: P) => (
  <svg {...base(p)}><path d="M3.5 14.5c4.7-4.2 12.3-4.2 17 0l-2.2 2.3-3.3-1.2v-2.3a10 10 0 0 0-6 0v2.3l-3.3 1.2z" fill="currentColor" stroke="none" /></svg>
)
export const IconGithub = (p: P) => (
  <svg {...base(p)} fill="currentColor" stroke="none"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.5c.5.1.7-.2.7-.5v-1.7c-2.7.6-3.2-1.2-3.2-1.2-.4-1.1-1-1.4-1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1 2.9.8.1-.6.3-1 .6-1.3-2.1-.2-4.3-1-4.3-4.7 0-1 .4-1.9 1-2.6-.1-.2-.4-1.2.1-2.5 0 0 .8-.3 2.6 1a9 9 0 0 1 4.8 0c1.8-1.3 2.6-1 2.6-1 .5 1.3.2 2.3.1 2.5.6.7 1 1.6 1 2.6 0 3.7-2.2 4.5-4.3 4.7.3.3.6.9.6 1.8v2.6c0 .3.2.6.7.5A9.5 9.5 0 0 0 12 2.5z" /></svg>
)
export const IconSparkle = (p: P) => (
  <svg {...base(p)}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18.5 15.5l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8z" /></svg>
)
