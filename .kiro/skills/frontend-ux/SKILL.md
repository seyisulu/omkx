# Frontend & UX Skill

Frontend development patterns and UX best practices for implementation.

## Framework-Agnostic Patterns

### Component Design
- Single responsibility per component
- Props down, events up
- Container/presentational separation
- Composition over inheritance

### State Management
- Keep state as close to usage as possible
- Derive computed values, don't store them
- Handle loading, empty, error, and success states
- Avoid prop drilling (use context or state management)

### Performance
- Lazy load routes and heavy components
- Memoize expensive computations
- Debounce/throttle user input handlers
- Optimize re-renders

### Accessibility (a11y)
- Semantic HTML elements
- ARIA labels for non-text content
- Keyboard navigation support
- Color contrast ratios (WCAG AA minimum)
- Focus management

### Responsive Design
- Mobile-first approach
- Breakpoints based on content, not devices
- Touch-friendly hit targets (min 44px)
- Test at multiple viewport sizes

### Error Handling
- Graceful error boundaries
- User-friendly error messages
- Retry mechanisms for network failures
- Offline fallbacks when applicable

## CSS/Styling
- Consistent naming convention (BEM, CSS Modules, etc.)
- Avoid !important
- Use CSS custom properties for theming
- Prefer relative units (rem, em, %) over px

## Testing
- Unit tests for logic and utilities
- Component tests for rendering and interaction
- Integration tests for user flows
- Visual regression tests for UI changes
