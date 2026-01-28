# Animation & Motion Reference Guide

A quick reference for all animations implemented in the frontend.

---

## Page Transitions

### Entry Animation

```
Page mounts
  ↓
Fade in: opacity 0 → 1
Y movement: translateY(8px) → 0
Duration: 0.4s
Easing: Custom ease (fast in, smooth out)
  ↓
Content fully visible
```

### Exit Animation

```
Route change triggered
  ↓
Fade out: opacity 1 → 0
Y movement: translateY(0) → -8px
Duration: 0.3s
  ↓
New page mounts
```

---

## Form Field Animations

### Entrance (Staggered)

```
Form renders
  ↓
Field 1: fade in + slide (0.1s delay)
Field 2: fade in + slide (0.15s delay)
Field 3: fade in + slide (0.2s delay)
Field 4: fade in + slide (0.25s delay)
Button: fade in + slide (0.3s delay)
  ↓
All fields visible
```

### Focus State

```
User clicks input
  ↓
Scale: 1 → 1.01
Border color: gray-700 → accent
Ring: ring-2 ring-accent/50 (glow)
Duration: 0.2s
  ↓
Input focused and highlighted
```

---

## Button Interactions

### Hover

```
Mouse over button
  ↓
Scale: 1 → 1.02 (2% growth)
Y: 0 → -1px (slight lift)
Shadow: md → lg with accent glow
Duration: 0.2s (spring)
  ↓
Button appears raised
```

### Press (Tap)

```
Mouse down on button
  ↓
Scale: 1.02 → 0.98 (4% compression)
Y: -1px → 0 (back to baseline)
Duration: instant (spring physics)
  ↓
Button appears pressed
```

### Loading State

```
Form submitted
  ↓
Button disabled
No hover/press animations
Text changes to "Creating Account..."
Opacity: opacity-50 on disabled
  ↓
Button awaits API response
```

---

## Error Message Animation

### Appear

```
Error state set
  ↓
Opacity: 0 → 1
Scale: 0.95 → 1
Duration: 0.3s (spring, stiffness: 300)
  ↓
Error visible with bounce
```

### Disappear

```
Error dismissed or new action
  ↓
Opacity: 1 → 0
Scale: 1 → 0.95
Duration: 0.3s
  ↓
Error removed
```

---

## Deal Card Animations

### Mount (Entrance)

```
Card enters viewport (30% visible threshold)
  ↓
Opacity: 0 → 1
Scale: 0.98 → 1
Y: 8px → 0
Duration: 0.4s
  ↓
Card fully visible and interactive
```

### Hover (Lift)

```
Mouse enters card
  ↓
Y: 0 → -6px (lift)
Shadow: 0 20px 40px rgba(59, 130, 246, 0.15) (blue glow)
Duration: 0.3s (spring)
  ↓
Card elevated with shadow
```

### Hover Effects (Sub-elements)

```
Card hover state active
  ↓
Badge/Title: text-white → text-accent (color)
Discount: scale 1 → 1.05 (emphasis)
Partner icon: rotate 0 → 5° (playful)
Partner card: x 0 → 2px (micro-shift)
Duration: 0.2s each
  ↓
All elements subtly enhanced
```

### Locked State

```
Card is locked (no verification)
  ↓
No hover animations applied
Overlay visible: bg-black/60 with backdrop blur
User sees visual differentiation
  ↓
Card not interactive
```

---

## Skeleton Loader Animation

### Pulse Effect

```
Skeleton renders
  ↓
Opacity: 0.5 → 1 → 0.5 (cycle)
Duration: 2s per cycle
Repeat: infinite
Ease: easeInOut
  ↓
Smooth, gentle pulsing
```

### Content Replace

```
API data arrives
  ↓
Skeleton opacity: 1 → 0 (fade out)
Real content opacity: 0 → 1 (fade in)
Duration: 0.3s
  ↓
Content visible, no layout shift
```

---

## Color Transitions

### Form Input Focus

```
Normal state
  ↓
Border: border-gray-700
Ring: ring-transparent
  ↓
User focuses
  ↓
Border: border-accent (blue)
Ring: ring-2 ring-accent/50 (glow)
Duration: 0.2s
  ↓
Focused state with accent highlight
```

### Link Hover

```
Normal state
  ↓
Color: text-accent
Text decoration: none
  ↓
User hovers
  ↓
Color: text-blue-400 (lighter blue)
Text decoration: none (no underline)
Duration: instant (CSS transition)
  ↓
Subtle color enhancement
```

---

## Timing Constants

| Animation | Duration | Easing | Use Case |
|-----------|----------|--------|----------|
| Page transitions | 0.4s | Custom ease | Route changes |
| Form field entrance | 0.3s | easeOut | Staggered input load |
| Button hover | 0.2s | spring(400, 17) | Micro-interaction |
| Card entrance | 0.4s | easeOut | Card mount |
| Card hover | 0.3s | spring(300, 20) | Hover elevation |
| Focus ring | 0.2s | easeOut | Input focus |
| Error message | 0.3s | spring(300, 20) | Error appearance |
| Skeleton pulse | 2.0s | easeInOut | Loading state |

---

## Easing Functions

### Spring Animations

Used for natural, bouncy interactions:

```typescript
// Button hovers
{ type: "spring", stiffness: 400, damping: 17 }

// Card hovers
{ type: "spring", stiffness: 300, damping: 20 }

// Error messages
{ type: "spring", stiffness: 300, damping: 20 }
```

### Curve Animations

Used for smooth, linear transitions:

```typescript
// Page entry
ease: [0.23, 1, 0.320, 1] // Fast in, smooth out

// Page exit
ease: "easeInOut"

// Pulse
ease: "easeInOut"
```

---

## Color Animation Reference

### Accent Color Variants

```
Base: #3b82f6 (blue)
Hover: #2563eb (darker blue)
Glow: rgba(59, 130, 246, 0.15) (transparent blue)
Ring: rgba(59, 130, 246, 0.50) (50% opacity)
```

### Shadow Colors

```
Button hover: shadow-accent/40 (40% opacity)
Card hover: rgba(59, 130, 246, 0.15) (blue glow)
Error glow: shadow-danger/10 (10% opacity)
```

---

## Accessibility Modes

### Prefers Reduced Motion

If user has `prefers-reduced-motion: reduce` set:

```
All transition durations → 0ms
All animations → disabled
All transforms → instant
```

This is handled by:
- Media query: `@media (prefers-reduced-motion: reduce)`
- Framer Motion respects system preference automatically

---

## Performance Notes

### GPU-Accelerated Properties

✅ These are optimized:
- `transform` (translate, scale, rotate)
- `opacity`

❌ These should be avoided:
- `width`, `height` (use transform instead)
- `top`, `left` (use transform instead)
- `background-color` in heavy animations

### Viewport Optimization

Cards use `whileInView` to animate only when:
- Element is in viewport
- Intersection observed at 30% visibility
- Animation fires once per page load

---

## Browser Support

All animations use:
- Framer Motion (v10+)
- CSS transitions (all modern browsers)
- Spring physics (hardware-accelerated)

**Tested on:**
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile (iOS Safari, Chrome)

---

## Customization Guide

To adjust any animation, modify `lib/motion-config.ts`:

```typescript
// Example: Make page entry slower
pageVariants: {
  animate: {
    transition: {
      duration: 0.6, // Increase from 0.4s
    }
  }
}

// Example: Make button hover lift higher
buttonInteraction: {
  whileHover: { y: -2 } // Increase from -1
}
```

Then all components using these presets automatically update.

---

## Quick Checklist

- [ ] Animations feel smooth (no stuttering)
- [ ] Page transitions don't flicker
- [ ] Button hovers feel responsive
- [ ] Form fields focus clearly
- [ ] Cards lift smoothly on hover
- [ ] Error messages appear naturally
- [ ] Skeletons pulse gently
- [ ] No layout shifts during animations
- [ ] Mobile touch interactions smooth
- [ ] Reduced motion preference respected

