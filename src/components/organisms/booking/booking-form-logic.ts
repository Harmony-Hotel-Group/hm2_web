/**
 * Booking Form Logic - Módulo independiente para evitar problemas de parsing de Astro
 * 
 * Este archivo contiene toda la lógica JavaScript del formulario de reservas
 * para evitar conflictos con el compilador de Astro cuando usa sintaxis <> fragment
 */

// ============================================
// 📦 TIPOS Y CONSTANTES
// ============================================

interface ChildAgeMap {
  [key: number]: string;
}

const GROUP_THRESHOLD = 8;
const STANDARD_DATE_RANGE_ID = 'booking-date-range';
const GROUP_DATE_RANGE_ID = 'booking-date-range-group';

// ============================================
// 💾 PERSISTENCIA DE ESTADO (sessionStorage)
// ============================================

export const saveFormState = (): void => {
  const formModeInput = document.getElementById('form-mode') as HTMLInputElement | null;
  const adultsSelect = document.getElementById('adults') as HTMLSelectElement | null;
  const childrenSelect = document.getElementById('children') as HTMLSelectElement | null;
  const roomsSelect = document.getElementById('rooms') as HTMLSelectElement | null;
  const distributionTypeSelect = document.getElementById('distribution-type') as HTMLSelectElement | null;
  
  const state: any = {
    mode: formModeInput?.value || 'standard',
    adults: adultsSelect?.value || '1',
    children: childrenSelect?.value || '',
    rooms: roomsSelect?.value || '1',
    distributionType: distributionTypeSelect?.value || 'shared_beds',
    childAges: {} as ChildAgeMap,
    parking: false,
    vehicleDetails: '',
    specialRequests: '',
  };

  // Guardar edades de niños
  const existingAges = new Map<number, string>();
  document.querySelectorAll('[data-child-age-input]').forEach((input, index) => {
    const htmlInput = input as HTMLInputElement;
    if (htmlInput.value) {
      existingAges.set(index + 1, htmlInput.value);
    }
  });
  state.childAges = Object.fromEntries(existingAges);

  // Guardar estado de parking
  const parkingToggle = document.getElementById('parking-toggle') as HTMLInputElement | null;
  state.parking = parkingToggle?.checked || false;

  // Guardar detalles de vehículo
  const vehicleDetails = document.getElementById('vehicle-details') as HTMLTextAreaElement | null;
  state.vehicleDetails = vehicleDetails?.value || '';

  // Guardar solicitudes especiales
  const specialRequests = document.getElementById('special-requests') as HTMLTextAreaElement | null;
  state.specialRequests = specialRequests?.value || '';

  sessionStorage.setItem('bookingFormState', JSON.stringify(state));
};

export const clearFormState = (): void => {
  sessionStorage.removeItem('bookingFormState');
};

export const restoreFormState = (): void => {
  const saved = sessionStorage.getItem('bookingFormState');
  if (!saved) return;

  try {
    const state = JSON.parse(saved);
    
    const formModeInput = document.getElementById('form-mode') as HTMLInputElement | null;
    const adultsSelect = document.getElementById('adults') as HTMLSelectElement | null;
    const childrenSelect = document.getElementById('children') as HTMLSelectElement | null;
    const roomsSelect = document.getElementById('rooms') as HTMLSelectElement | null;
    const distributionTypeSelect = document.getElementById('distribution-type') as HTMLSelectElement | null;

    if (formModeInput && state.mode) {
      formModeInput.value = state.mode;
      // Disparar evento change para actualizar UI
      formModeInput.dispatchEvent(new Event('change', { bubbles: true }));
    }

    if (adultsSelect && state.adults) adultsSelect.value = state.adults;
    if (childrenSelect && state.children) childrenSelect.value = state.children;
    if (roomsSelect && state.rooms) roomsSelect.value = state.rooms;
    if (distributionTypeSelect && state.distributionType) {
      distributionTypeSelect.value = state.distributionType;
    }

    // Restaurar edades de niños (se hará al renderizar los inputs)
    if (state.childAges) {
      // Las edades se restaurarán cuando se generen los inputs
      window.dispatchEvent(new CustomEvent('restore-child-ages', { 
        detail: { ages: state.childAges } 
      }));
    }

    // Restaurar parking
    if (state.parking !== undefined) {
      const parkingToggle = document.getElementById('parking-toggle') as HTMLInputElement | null;
      if (parkingToggle) {
        parkingToggle.checked = state.parking;
        parkingToggle.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    // Restaurar vehículo
    if (state.vehicleDetails) {
      const vehicleDetails = document.getElementById('vehicle-details') as HTMLTextAreaElement | null;
      if (vehicleDetails) vehicleDetails.value = state.vehicleDetails;
    }

    // Restaurar solicitudes especiales
    if (state.specialRequests) {
      const specialRequests = document.getElementById('special-requests') as HTMLTextAreaElement | null;
      if (specialRequests) specialRequests.value = state.specialRequests;
    }
  } catch (e) {
    console.error('Error restoring form state:', e);
    clearFormState();
  }
};

// ============================================
// 👶 GESTIÓN DE EDADES DE NIÑOS
// ============================================

export const renderChildrenAgeInputs = (count: number): void => {
  const childrenAgesSection = document.getElementById('children-ages-section');
  const childrenAgesList = document.getElementById('children-ages-list');
  const childrenAgesInfo = document.getElementById('children-ages-info');

  if (!childrenAgesSection || !childrenAgesList) return;

  if (count <= 0) {
    childrenAgesSection.classList.add('hidden');
    if (childrenAgesInfo) {
      childrenAgesInfo.classList.add('hidden');
      childrenAgesInfo.textContent = '';
    }
    return;
  }

  childrenAgesSection.classList.remove('hidden');

  // Obtener edades guardadas (si existen)
  let existingAges = new Map<number, string>();
  const restoreEvent = new CustomEvent('get-restored-ages', {
    detail: { callback: (ages: ChildAgeMap) => {
      existingAges = new Map(Object.entries(ages).map(([k, v]) => [parseInt(k), v]));
    }}
  });
  window.dispatchEvent(restoreEvent);

  // Limpiar lista actual
  childrenAgesList.innerHTML = '';

  for (let i = 1; i <= count; i++) {
    const field = document.createElement('div');
    field.className = 'rounded-md border border-gray-500 bg-white p-2';
    
    const label = document.createElement('label');
    label.htmlFor = `child-age-${i}`;
    label.className = 'block text-xs font-medium text-black mb-1';
    label.textContent = `Ni\u00f1o ${i}: edad`;
    
    const input = document.createElement('input');
    input.id = `child-age-${i}`;
    input.name = `child_age_${i}`;
    input.type = 'number';
    input.min = '0';
    input.max = '17';
    input.placeholder = 'Edad';
    input.className = 'w-full h-[42px] px-3 py-2 text-sm text-black border border-gray-500 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all bg-white placeholder:text-gray-700';
    input.setAttribute('data-child-age-input', '');
    
    const warning = document.createElement('p');
    warning.className = 'hidden mt-1 text-xs text-red-700';
    warning.setAttribute('data-child-age-warning', `child_age_${i}`);
    
    field.appendChild(label);
    field.appendChild(input);
    field.appendChild(warning);
    childrenAgesList.appendChild(field);

    // Restaurar valor si existe
    const restoredValue = existingAges.get(i);
    const childInput = field.querySelector('[data-child-age-input]') as HTMLInputElement | null;
    if (childInput && typeof restoredValue === 'string') {
      childInput.value = restoredValue;
    }
  }

  childrenAgesList.querySelectorAll('[data-child-age-input]').forEach((input) => {
    const htmlInput = input as HTMLInputElement;
    htmlInput.addEventListener('input', () => {
      updateChildrenAgesMessages();
      saveFormState();
    });
  });

  updateChildrenAgesMessages();
};

export const updateChildrenAgesMessages = (): void => {
  const childrenAgesInfo = document.getElementById('children-ages-info');
  if (!childrenAgesInfo) return;

  const inputs = childrenAgesInfo.parentElement?.querySelectorAll('[data-child-age-input]') || [];
  let hasWarnings = false;
  let messages: string[] = [];

  inputs.forEach((input, idx) => {
    const htmlInput = input as HTMLInputElement;
    const age = parseInt(htmlInput.value) || 0;
    const warning = htmlInput.parentElement?.querySelector('[data-child-age-warning]') as HTMLElement | null;

    if (age > 12) {
      hasWarnings = true;
      if (warning) {
        warning.classList.remove('hidden');
        warning.textContent = '* Se considera tarifa de adulto';
      }
      messages.push(`Ni\u00f1o ${idx + 1}: tarifa de adulto aplica`);
    } else if (age > 0 && age <= 12) {
      if (warning) warning.classList.add('hidden');
    } else if (htmlInput.value && age === 0) {
      if (warning) {
        warning.classList.remove('hidden');
        warning.textContent = '* Infantes gratis (0 años)';
      }
    }
  });

  if (hasWarnings) {
    childrenAgesInfo.classList.remove('hidden', 'text-green-700');
    childrenAgesInfo.classList.add('text-orange-700');
    childrenAgesInfo.textContent = '* Algunos niños superan la edad máxima y se les aplicará tarifa de adulto';
  } else if (messages.length > 0) {
    childrenAgesInfo.classList.remove('hidden', 'text-orange-700');
    childrenAgesInfo.classList.add('text-green-700');
    childrenAgesInfo.textContent = 'Edades registradas correctamente';
  } else {
    childrenAgesInfo.classList.add('hidden');
  }
};

// ============================================
// 🎯 INICIALIZACIÓN
// ============================================

export const initBookingForm = (): void => {
  // Elementos del DOM
  const form = document.getElementById('booking-form') as HTMLFormElement | null;
  const formModeInput = document.getElementById('form-mode') as HTMLInputElement | null;
  const adultsSelect = document.getElementById('adults') as HTMLSelectElement | null;
  const childrenSelect = document.getElementById('children') as HTMLSelectElement | null;
  const childrenAgesSection = document.getElementById('children-ages-section');
  const extrasRow = document.getElementById('extras-row');
  const cancelGroupBtn = document.getElementById('btn-cancel-group');
  const parkingToggle = document.getElementById('parking-toggle') as HTMLInputElement | null;
  const vehicleSection = document.getElementById('vehicle-section');
  const specialRequestToggle = document.getElementById('special-request-toggle') as HTMLInputElement | null;
  const specialRequestSection = document.getElementById('special-request-section');
  const specialRequestsInput = document.getElementById('special-requests') as HTMLTextAreaElement | null;

  if (!form || !formModeInput || !adultsSelect) {
    console.error('BookingForm: Elementos requeridos no encontrados');
    return;
  }

  // ============================================
  // 🔄 RESTAURAR ESTADO AL INICIAR
  // ============================================
  restoreFormState();

  // ============================================
  // 📅 SINCRONIZACIÓN DE FECHAS
  // ============================================
  const getDatePairByRangeId = (rangeId: string) => {
    const checkin = document.querySelector(
      `[data-checkin-hidden="${rangeId}"]`
    ) as HTMLInputElement | null;
    const checkout = document.querySelector(
      `[data-checkout-hidden="${rangeId}"]`
    ) as HTMLInputElement | null;
    return { checkin, checkout };
  };

  const hasSelectedDateRange = () => {
    const mode = formModeInput.value;
    const activeRangeId = mode === 'group' ? GROUP_DATE_RANGE_ID : STANDARD_DATE_RANGE_ID;
    const active = getDatePairByRangeId(activeRangeId);
    return Boolean(active.checkin?.value && active.checkout?.value);
  };

  const syncExtrasVisibility = () => {
    const visible = hasSelectedDateRange();
    extrasRow?.classList.toggle('hidden', !visible);

    if (!visible) {
      if (specialRequestSection) specialRequestSection.classList.add('hidden');
      if (vehicleSection) vehicleSection.classList.add('hidden');
    } else if (specialRequestToggle && specialRequestSection) {
      specialRequestSection.classList.toggle('hidden', !specialRequestToggle.checked);
    }

    if (visible && parkingToggle && vehicleSection) {
      vehicleSection.classList.toggle('hidden', !parkingToggle.checked);
    }
  };

  // Escuchar cambios en date range picker
  document.addEventListener('dateRangeChange', syncExtrasVisibility);
  setTimeout(syncExtrasVisibility, 200);

  // ============================================
  // 👥 MODO INDIVIDUAL vs GRUPO
  // ============================================
  const toggleGroupMode = () => {
    const isGroup = formModeInput.value === 'group';
    const adultCount = parseInt(adultsSelect.value) || 1;
    const isGroupByCount = adultCount >= GROUP_THRESHOLD;

    if (isGroupByCount && !isGroup) {
      formModeInput.value = 'group';
      if (cancelGroupBtn) cancelGroupBtn.classList.remove('hidden');
    } else if (!isGroupByCount && isGroup) {
      formModeInput.value = 'standard';
      if (cancelGroupBtn) cancelGroupBtn.classList.add('hidden');
    }

    syncExtrasVisibility();
    saveFormState();
  };

  adultsSelect.addEventListener('change', toggleGroupMode);
  formModeInput.addEventListener('change', () => {
    syncExtrasVisibility();
    saveFormState();
  });

  if (cancelGroupBtn) {
    cancelGroupBtn.addEventListener('click', () => {
      formModeInput.value = 'standard';
      cancelGroupBtn.classList.add('hidden');
      syncExtrasVisibility();
      saveFormState();
    });
  }

  // ============================================
  // 👶 EDAD DE NIÑOS
  // ============================================
  const handleChildrenChange = () => {
    const count = parseInt(childrenSelect?.value || '0') || 0;
    renderChildrenAgeInputs(count);
    saveFormState();
  };

  childrenSelect?.addEventListener('change', handleChildrenChange);
  
  // Manejar evento de restauración de edades
  window.addEventListener('get-restored-ages', ((e: Event) => {
    const customEvent = e as CustomEvent;
    const saved = sessionStorage.getItem('bookingFormState');
    if (saved && customEvent.detail?.callback) {
      try {
        const state = JSON.parse(saved);
        customEvent.detail.callback(state.childAges || {});
      } catch (err) {
        customEvent.detail.callback({});
      }
    }
  }) as EventListener);

  // ============================================
  // 🚗 PARKING Y VEHÍCULOS
  // ============================================
  parkingToggle?.addEventListener('change', () => {
    if (vehicleSection) {
      vehicleSection.classList.toggle('hidden', !parkingToggle.checked);
    }
    syncExtrasVisibility();
    saveFormState();
  });

  // ============================================
  // 💬 SOLICITUDES ESPECIALES
  // ============================================
  specialRequestToggle?.addEventListener('change', () => {
    if (specialRequestSection) {
      specialRequestSection.classList.toggle('hidden', !specialRequestToggle.checked);
    }
    syncExtrasVisibility();
    saveFormState();
  });

  // ============================================
  // 📝 ENVÍO DEL FORMULARIO
  // ============================================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validar fechas
    const mode = formModeInput.value;
    const activeRangeId = mode === 'group' ? GROUP_DATE_RANGE_ID : STANDARD_DATE_RANGE_ID;
    const active = getDatePairByRangeId(activeRangeId);
    
    if (!active.checkin?.value || !active.checkout?.value) {
      alert('Por favor selecciona fechas de check-in y check-out');
      return;
    }

    // Validar edades de niños
    let hasChildAgeErrors = false;
    document.querySelectorAll('[data-child-age-input]').forEach((input) => {
      const htmlInput = input as HTMLInputElement;
      const warning = htmlInput.parentElement?.querySelector('[data-child-age-warning]') as HTMLElement | null;
      
      if (!htmlInput.value && childrenSelect && parseInt(childrenSelect.value) > 0) {
        htmlInput.classList.add('border-red-500');
        if (warning) {
          warning.classList.remove('hidden');
          warning.textContent = '* Edad requerida';
        }
        hasChildAgeErrors = true;
      } else {
        htmlInput.classList.remove('border-red-500');
        if (warning && !warning.textContent?.includes('tarifa') && !warning.textContent?.includes('Infantes')) {
          warning.classList.add('hidden');
        }
      }
    });

    if (hasChildAgeErrors) {
      alert('Por favor ingresa las edades de todos los niños');
      return;
    }

    // Validar vehículos si se seleccionó parking
    if (parkingToggle?.checked) {
      const vehicleDetails = document.getElementById('vehicle-details') as HTMLTextAreaElement | null;
      if (!vehicleDetails?.value.trim()) {
        alert('Por favor ingresa los detalles del vehículo');
        vehicleDetails?.focus();
        return;
      }
    }

    // Preparar datos
    const formData = new FormData(form);
    const data: any = Object.fromEntries(formData.entries());
    data.form_mode = mode;

    // Agregar edades de niños
    const childAges: any = {};
    document.querySelectorAll('[data-child-age-input]').forEach((input, idx) => {
      const htmlInput = input as HTMLInputElement;
      if (htmlInput.value) {
        childAges[`child_age_${idx + 1}`] = htmlInput.value;
      }
    });
    Object.assign(data, childAges);

    console.log('📤 Enviando reserva:', data);

    // Simular envío
    const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="ml-2">Procesando...</span>
      `;
    }

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Aquí iría la llamada real a la API
    console.log('✅ Reserva procesada exitosamente');
    
    // Mostrar modal de confirmación (si existe)
    const modal = document.getElementById('booking-summary-modal');
    if (modal) {
      modal.classList.remove('hidden');
    } else {
      alert('¡Reserva procesada exitosamente!');
    }

    // Resetear botón
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span>Reservar Ahora</span>';
    }

    // Opcional: limpiar formulario
    // form.reset();
    // clearFormState();
  });

  // Guardar estado en cada cambio
  form.addEventListener('input', saveFormState);
  form.addEventListener('change', saveFormState);
};

// ============================================
// 🚀 AUTO-EJECUCIÓN
// ============================================

// Inicializar cuando el DOM esté listo
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBookingForm);
  } else {
    initBookingForm();
  }
}
