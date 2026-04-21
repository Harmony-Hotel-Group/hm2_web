# Debug & Fix Date Picker en BookingBar

## ✅ Paso 1: Logs agregados ✓
- [x] DateRangePickerField.astro: initPicker(), initializeDateRangePickers(), clicks
- [x] BookingForm.astro: date-range:change listener
- [x] TODO.md creado

## 🔍 Paso 2: Recopilar logs (TU TURNO)
```
1. npm run dev  (o astro dev)
2. localhost:4321 → F12 Console
3. RECARGAR página
4. CLICK campo "Ingreso y salida" 
5. COPIAR TODOS logs 🔵🔴 aquí
```

## ⏳ Pendientes post-logs
```
[ ] Analizar output → ¿Falla CDN? ¿0 inputs? ¿No init?
[ ] Fix root cause  
[ ] npm install flatpickr (local)
[ ] MutationObserver para fixed BookingBar
[ ] Integrar utils/date.ts
[ ] Limpiar logs
[ ] ✅ Task complete
```

## 💡 Si NO ves logs iniciales:
- Network tab: ¿Cargan flatpickr.min.css/js/l10n/es.js? (200 OK)
- Console rojo: ¿Errores Flatpickr?

**¡Pega los logs y fix en 2 mins! 🚀**


