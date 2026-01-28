# Motion Enhancements - Quick Start Guide

## For Developers: How to Use the Motion System

---

## Installation & Setup

✅ **Already Done** — No additional setup required!

All animations use:
- Framer Motion (already in `package.json`)
- Motion config (new in `lib/motion-config.ts`)
- Existing Tailwind CSS

Just start using the presets.

---

## Basic Usage

### 1. Import Motion Config

```typescript
import {
  pageVariants,
  containerVariants,
  itemVariants,
  buttonInteraction,
  formInputFocus,
} from "@/lib/motion-config";
```

### 2. Use on Motion Elements

```typescript
import { motion } from "framer-motion";

// Page-level animation
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
>
  {/* Page content */}
</motion.div>
```

---

## Common Patterns

### Pattern 1: Page Entry

```typescript
<motion.div
  variants={pageVariants}
  initial="initial"
  animate="animate"
  className="page-container"
>
  {/* Your page content */}
</motion.div>
```

**Result**: Smooth fade-in + subtle Y-slide on page load

---

### Pattern 2: Staggered List

```typescript
<motion.div
  variants={containerVariants}
  initial="initial"
  animate="animate"
>
  {items.map((item) => (
    <motion.div key={item.id} variants={itemVariants}>
      {/* Item content */}
    </motion.div>
  ))}
</motion.div>
```

**Result**: Each item fades in with slight delay between them

---

### Pattern 3: Button Interaction

```typescript
<motion.button
  {...buttonInteraction}
  onClick={handleClick}
  className="btn-primary"
>
  Click Me
</motion.button>
```

**Result**: Hover lift + press feedback

---

### Pattern 4: Form Input Focus

```typescript
<motion.input
  whileFocus={formInputFocus}
  className="input-field focus:ring-2 focus:ring-accent/50"
  type="email"
/>
```

**Result**: Input scales slightly on focus with ring glow

---

### Pattern 5: Card with Hover

```typescript
<motion.div
  whileHover={{ y: -6, boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)" }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
  className="card"
>
  {/* Card content */}
</motion.div>
```

**Result**: Card lifts with shadow glow on hover

---

## Quick Reference: Presets

### `pageVariants`

Use for: Full-page transitions

```typescript
<motion.div variants={pageVariants} initial="initial" animate="animate">
```

**Animations**:
- Enter: Fade in + Y-slide up
- Exit: Fade out + Y-slide down

---

### `containerVariants`

Use for: Container with child items

```typescript
<motion.div variants={containerVariants} initial="initial" animate="animate">
  {/* Children use itemVariants */}
</motion.div>
```

**Animations**:
- Stagger: 0.05s between children
- Delay: 0.1s before first child

---

### `itemVariants`

Use for: Individual items in container

```typescript
<motion.div variants={itemVariants}>
```

**Animations**:
- Fade in: 0 → 1
- Slide up: 4px → 0

---

### `cardVariants`

Use for: Individual cards/components

```typescript
<motion.div variants={cardVariants} initial="initial" whileInView="animate">
```

**Animations**:
- Fade in: 0 → 1
- Scale: 0.98 → 1
- Slide up: 8px → 0

---

### `buttonInteraction`

Use for: Buttons with hover/press

```typescript
<motion.button {...buttonInteraction}>
```

**Animations**:
- Hover: Scale 1.02 + Y-1px
- Press: Scale 0.98

---

### `formInputFocus`

Use for: Form inputs on focus

```typescript
<motion.input whileFocus={formInputFocus} />
```

**Animations**:
- Focus: Scale 1.01

---

## Customization

### Change Timing

Edit `lib/motion-config.ts`:

```typescript
export const pageVariants = {
  animate: {
    transition: {
      duration: 0.5, // Change from 0.4
    }
  }
}
```

All pages automatically use the new timing.

### Change Easing

```typescript
export const pageVariants = {
  animate: {
    transition: {
      ease: "easeInOut", // Change easing curve
    }
  }
}
```

### Create New Preset

Add to `lib/motion-config.ts`:

```typescript
export const customSlideVariants = {
  initial: { opacity: 0, x: -20 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};
```

Then import and use:

```typescript
import { customSlideVariants } from "@/lib/motion-config";

<motion.div variants={customSlideVariants} initial="initial" animate="animate">
```

---

## Testing Animations

### In Browser DevTools

1. Open Chrome DevTools (F12)
2. Click **Rendering** tab
3. Check **Reduce motion** checkbox
4. Verify animations disable

### On Device with Reduced Motion

**macOS**:
System Preferences → Accessibility → Display → Reduce motion

**Windows**:
Settings → Ease of Access → Display → Show animations

**iOS**:
Settings → Accessibility → Motion → Reduce Motion

**Android**:
Settings → Accessibility → Remove animations

---

## Performance Tips

### Good Practices

✅ Use `transform` and `opacity` only
```typescript
animate={{ scale: 1.02, opacity: 1 }} // Good
```

❌ Avoid animating layout properties
```typescript
animate={{ width: 200, height: 100 }} // Avoid
```

✅ Use `whileInView` for scroll animations
```typescript
whileInView={{ opacity: 1 }}
viewport={{ once: true, amount: 0.3 }}
```

❌ Don't animate on every state change
```typescript
// Avoid unless really needed
animate={isLoading ? { opacity: 0.5 } : { opacity: 1 }}
```

---

## Common Issues & Solutions

### Issue: Animation Not Running

**Solution**: Check initial state

```typescript
// Wrong
<motion.div animate={{ opacity: 1 }}>

// Right
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
```

### Issue: Animation Too Fast/Slow

**Solution**: Adjust duration in `motion-config.ts`

```typescript
transition: { duration: 0.5 } // Increase for slower
```

### Issue: Animation Feels Jarring

**Solution**: Use spring damping for smooth feel

```typescript
transition: {
  type: "spring",
  stiffness: 300,
  damping: 20
}
```

### Issue: Animation Breaks on Mobile

**Solution**: Use `whileInView` instead of `animate`

```typescript
whileInView={{ opacity: 1 }}
viewport={{ once: true }}
```

---

## Accessibility Checklist

When adding new animations:

- [ ] Respect `prefers-reduced-motion`
- [ ] Focus states remain visible
- [ ] No color-only information changes
- [ ] No strobing or flashing
- [ ] Content accessible without animation
- [ ] Test with keyboard only

---

## File Structure

```
frontend/
├── lib/
│   └── motion-config.ts ........... All animation presets
├── app/
│   ├── register/page.tsx ......... Uses pageVariants, containerVariants
│   ├── login/page.tsx ............ Uses pageVariants, containerVariants
│   └── globals.css ............... Smooth transitions
└── components/
    └── DealCard.tsx .............. Uses cardVariants, custom hover
```

---

## Next Steps

### To Add Animations to a Component

1. Import presets from `lib/motion-config.ts`
2. Wrap elements with `<motion.div>`
3. Apply `variants` prop
4. Set `initial` and `animate` states
5. Test in browser (should be smooth)
6. Test with reduced motion enabled

### To Customize Animations

1. Edit `lib/motion-config.ts`
2. Adjust `duration`, `ease`, or `stiffness`/`damping`
3. Components automatically update
4. No other files need changes

### To Add New Animation Type

1. Create new variant in `lib/motion-config.ts`
2. Export it
3. Import in component
4. Apply to motion elements
5. Test thoroughly

---

## Useful Resources

- **Framer Motion Docs**: https://www.framer.com/motion/
- **Spring Physics**: https://www.framer.com/motion/gestures/
- **Easing Explorer**: https://easings.net/
- **WCAG Animation**: https://www.w3.org/WAI/WCAG21/Understanding/animation-from-interactions

---

## TL;DR - Super Quick Start

**1. Use page transition:**
```typescript
<motion.div variants={pageVariants} initial="initial" animate="animate">
```

**2. Use staggered list:**
```typescript
<motion.div variants={containerVariants} initial="initial" animate="animate">
  {items.map(i => <motion.div variants={itemVariants} key={i.id}>...)</}
</motion.div>
```

**3. Use button interaction:**
```typescript
<motion.button {...buttonInteraction}>...
```

**4. Use card hover:**
```typescript
<motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
```

**Done!** Your component now has smooth, professional animations.

---

## Questions?

1. Check `ANIMATION_REFERENCE.md` for detailed timing/easing
2. Check existing components for examples
3. Review `MOTION_ENHANCEMENTS.md` for design principles
4. Refer to Framer Motion docs for advanced features

---

**Happy animating!** 🎬

