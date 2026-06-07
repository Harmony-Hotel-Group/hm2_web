/**
 * Lógica externa para BookingForm.astro
 * Maneja estado, validación, persistencia y eventos del DOM.
 */

export interface BookingState {
  mode: 'individual' | 'group';
  adults: number;
  children: number;
  childAges: number[];
  checkIn: string;
  checkOut: string;
  vehicleType: 'none' | 'car' | 'motorcycle';
  vehiclePlate?: string;
  specialRequests: string;
  timestamp: number;
}

const STORAGE_KEY = 'hotel_majestic_booking_state';
const DEFAULT_STATE: BookingState = {
  mode: 'individual',
  adults: 2,
  children: 0,
  childAges: [],
  checkIn: '',
  checkOut: '',
  vehicleType: 'none',
  vehiclePlate: '',
  specialRequests: '',
  timestamp: Date.now(),
};

// --- Persistencia ---

export function loadState(): BookingState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (!saved) return DEFAULT_STATE;
    
    const parsed = JSON.parse(saved) as BookingState;
    
    // Validar que no sea muy antiguo (ej. 24 horas)
    const oneDay = 24 * 60 * 60 * 1000;
    if (Date.now() - parsed.timestamp > oneDay) {
      sessionStorage.removeItem(STORAGE_KEY);
      return DEFAULT_STATE;
    }
    
    return parsed;
  } catch (e) {
    console.error('Error cargando estado del formulario:', e);
    return DEFAULT_STATE;
  }
}

export function saveState(state: BookingState): void {
  if (typeof window === 'undefined') return;
  
  const stateToSave = { ...state, timestamp: Date.now() };
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
}

export function clearState(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(STORAGE_KEY);
}

// --- Generación de UI Dinámica ---

export function renderChildAgeInputs(
  container: HTMLElement, 
  count: number, 
  currentAges: number[],
  t: (key: string) => string
): number[] {
  container.innerHTML = '';
  const newAges: number[] = [];

  for (let i = 0; i < count; i++) {
    const age = currentAges[i] || 5; // Default 5 años
    newAges.push(age);

    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-col gap-1';
    
    const label = document.createElement('label');
    label.className = 'text-sm font-medium text-gray-700';
    // Usamos unicode para evitar problemas de encoding
    label.textContent = `${t('booking.childAge')} ${i + 1} (Ni\u00f1o ${i + 1})`;
    label.htmlFor = `child-age-${i}`;
    
    const select = document.createElement('select');
    select.id = `child-age-${i}`;
    select.name = `childAge_${i}`;
    select.className = 'w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-accent-gold focus:border-transparent';
    select.setAttribute('aria-label', `${t('booking.childAge')} ${i + 1}`);
    
    for (let age = 1; age <= 12; age++) {
      const option = document.createElement('option');
      option.value = age.toString();
      option.textContent = `${age} ${t('common.years')}`;
      option.selected = age === age;
      select.appendChild(option);
    }
    
    // Restaurar valor si existía
    if (currentAges[i]) {
      select.value = currentAges[i].toString();
    }

    select.addEventListener('change', () => {
      // El padre manejará la actualización del estado global
      const event = new CustomEvent('childAgeChange', { 
        detail: { index: i, age: parseInt(select.value) } 
      });
      wrapper.dispatchEvent(event);
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    container.appendChild(wrapper);
  }

  return newAges;
}

// --- Validación ---

export interface ValidationError {
  field: string;
  message: string;
}

export function validateForm(state: BookingState, t: (key: string) => string): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!state.checkIn) {
    errors.push({ field: 'checkIn', message: t('errors.checkInRequired') });
  }
  
  if (!state.checkOut) {
    errors.push({ field: 'checkOut', message: t('errors.checkOutRequired') });
  }
  
  if (state.checkIn && state.checkOut && new Date(state.checkIn) >= new Date(state.checkOut)) {
    errors.push({ field: 'checkOut', message: t('errors.invalidDates') });
  }

  if (state.adults < 1) {
    errors.push({ field: 'adults', message: t('errors.minAdults') });
  }

  if (state.vehicleType !== 'none' && !state.vehiclePlate?.trim()) {
    errors.push({ field: 'vehiclePlate', message: t('errors.plateRequired') });
  }

  // Validar edades de niños si hay niños
  if (state.children > 0 && state.childAges.length !== state.children) {
    errors.push({ field: 'childAges', message: t('errors.childAgesRequired') });
  }

  return errors;
}

// --- Utilidades de Fecha ---

export function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function getMinDate(): string {
  return formatDateForInput(new Date());
}

// --- Inicialización ---

export function initializeBookingForm(
  formElement: HTMLFormElement,
  translations: Record<string, string>,
  onStateChange?: (state: BookingState) => void
): { destroy: () => void } {
  
  const t = (key: string): string => {
    return translations[key] || key;
  };

  // Cargar estado inicial
  let currentState = loadState();
  
  // Elementos del DOM
  const modeIndividualRadio = formElement.querySelector('input[name="mode"][value="individual"]') as HTMLInputElement;
  const modeGroupRadio = formElement.querySelector('input[name="mode"][value="group"]') as HTMLInputElement;
  const adultsSelect = formElement.querySelector('select[name="adults"]') as HTMLSelectElement;
  const childrenSelect = formElement.querySelector('select[name="children"]') as HTMLSelectElement;
  const childAgesContainer = formElement.querySelector('#child-ages-container') as HTMLElement;
  const checkInInput = formElement.querySelector('input[name="checkIn"]') as HTMLInputElement;
  const checkOutInput = formElement.querySelector('input[name="checkOut"]') as HTMLInputElement;
  const vehicleTypeSelect = formElement.querySelector('select[name="vehicleType"]') as HTMLSelectElement;
  const vehiclePlateInput = formElement.querySelector('input[name="vehiclePlate"]') as HTMLInputElement;
  const vehicleSection = formElement.querySelector('#vehicle-section') as HTMLElement;
  const specialRequestsTextarea = formElement.querySelector('textarea[name="specialRequests"]') as HTMLTextAreaElement;
  const submitButton = formElement.querySelector('button[type="submit"]') as HTMLButtonElement;
  const errorContainer = formElement.querySelector('#form-errors') as HTMLElement;

  // Función para actualizar UI desde el estado
  const updateUIFromState = () => {
    if (modeIndividualRadio) modeIndividualRadio.checked = currentState.mode === 'individual';
    if (modeGroupRadio) modeGroupRadio.checked = currentState.mode === 'group';
    if (adultsSelect) adultsSelect.value = currentState.adults.toString();
    if (childrenSelect) childrenSelect.value = currentState.children.toString();
    if (checkInInput) checkInInput.value = currentState.checkIn;
    if (checkOutInput) checkOutInput.value = currentState.checkOut;
    if (vehicleTypeSelect) vehicleTypeSelect.value = currentState.vehicleType;
    if (vehiclePlateInput) vehiclePlateInput.value = currentState.vehiclePlate || '';
    if (specialRequestsTextarea) specialRequestsTextarea.value = currentState.specialRequests;

    // Renderizar inputs de edades
    if (childAgesContainer) {
      currentState.childAges = renderChildAgeInputs(
        childAgesContainer, 
        currentState.children, 
        currentState.childAges,
        t
      );
    }

    // Mostrar/ocultar sección de vehículos
    if (vehicleSection) {
      vehicleSection.style.display = currentState.vehicleType !== 'none' ? 'block' : 'none';
    }

    if (onStateChange) onStateChange(currentState);
  };

  // Función para mostrar errores
  const showErrors = (errors: ValidationError[]) => {
    if (!errorContainer) return;
    
    if (errors.length === 0) {
      errorContainer.innerHTML = '';
      errorContainer.style.display = 'none';
      return;
    }

    errorContainer.innerHTML = `
      <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
        <h3 class="text-sm font-medium text-red-800">${t('errors.formHasErrors')}</h3>
        <ul class="mt-2 list-disc list-inside text-sm text-red-700">
          ${errors.map(e => `<li>${e.message}</li>`).join('')}
        </ul>
      </div>
    `;
    errorContainer.style.display = 'block';
    
    // Scroll al primer error
    const firstErrorField = errors[0].field;
    const fieldElement = formElement.querySelector(`[name="${firstErrorField}"]`) as HTMLElement;
    if (fieldElement) {
      fieldElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      fieldElement.focus();
    }
  };

  // Función para manejar envío
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    
    const submitText = document.getElementById('booking-submit-text');
    const loadingSpinner = document.getElementById('booking-loading-spinner');
    
    if (submitButton) {
      submitButton.disabled = true;
      if (submitText) submitText.textContent = `${t('booking.processing')}...`;
      if (loadingSpinner) loadingSpinner.classList.remove('hidden');
    }

    showErrors([]);
    
    // Re-validar antes de enviar
    const errors = validateForm(currentState, t);
    if (errors.length > 0) {
      showErrors(errors);
      if (submitButton) {
        submitButton.disabled = false;
        if (submitText) submitText.textContent = t('common.bookNow');
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
      }
      return;
    }

    // Simular envío (aquí iría la llamada real a API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Éxito
      alert(t('booking.success'));
      clearState();
      // Redirigir o resetear formulario
      // window.location.href = '/confirmacion';
    } catch (error) {
      console.error('Error al reservar:', error);
      showErrors([{ field: 'general', message: t('errors.bookingFailed') }]);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        if (submitText) submitText.textContent = t('common.bookNow');
        if (loadingSpinner) loadingSpinner.classList.add('hidden');
      }
    }
  };

  // Listeners
  const handleModeChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    currentState.mode = target.value as 'individual' | 'group';
    saveState(currentState);
    if (onStateChange) onStateChange(currentState);
  };

  const handleAdultsChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    currentState.adults = parseInt(target.value);
    saveState(currentState);
    if (onStateChange) onStateChange(currentState);
  };

  const handleChildrenChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    currentState.children = parseInt(target.value);
    currentState.childAges = new Array(currentState.children).fill(5);
    saveState(currentState);
    updateUIFromState(); // Re-renderizar inputs de edades
    if (onStateChange) onStateChange(currentState);
  };

  const handleChildAgeChange = (e: CustomEvent) => {
    const { index, age } = e.detail;
    currentState.childAges[index] = age;
    saveState(currentState);
    if (onStateChange) onStateChange(currentState);
  };

  const handleDateChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    if (target.name === 'checkIn') currentState.checkIn = target.value;
    if (target.name === 'checkOut') currentState.checkOut = target.value;
    saveState(currentState);
    if (onStateChange) onStateChange(currentState);
  };

  const handleVehicleTypeChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    currentState.vehicleType = target.value as 'none' | 'car' | 'motorcycle';
    if (currentState.vehicleType === 'none') {
      currentState.vehiclePlate = '';
    }
    saveState(currentState);
    updateUIFromState();
    if (onStateChange) onStateChange(currentState);
  };

  const handleVehiclePlateChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    currentState.vehiclePlate = target.value;
    saveState(currentState);
    if (onStateChange) onStateChange(currentState);
  };

  const handleSpecialRequestsChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    currentState.specialRequests = target.value;
    saveState(currentState);
    if (onStateChange) onStateChange(currentState);
  };

  // Agregar listeners
  if (modeIndividualRadio) modeIndividualRadio.addEventListener('change', handleModeChange);
  if (modeGroupRadio) modeGroupRadio.addEventListener('change', handleModeChange);
  if (adultsSelect) adultsSelect.addEventListener('change', handleAdultsChange);
  if (childrenSelect) childrenSelect.addEventListener('change', handleChildrenChange);
  if (childAgesContainer) {
    childAgesContainer.addEventListener('childAgeChange', handleChildAgeChange as EventListener);
  }
  if (checkInInput) checkInInput.addEventListener('change', handleDateChange);
  if (checkOutInput) checkOutInput.addEventListener('change', handleDateChange);
  if (vehicleTypeSelect) vehicleTypeSelect.addEventListener('change', handleVehicleTypeChange);
  if (vehiclePlateInput) vehiclePlateInput.addEventListener('input', handleVehiclePlateChange);
  if (specialRequestsTextarea) specialRequestsTextarea.addEventListener('input', handleSpecialRequestsChange);
  
  formElement.addEventListener('submit', handleSubmit);

  // Inicializar UI
  updateUIFromState();

  // Función de limpieza
  return {
    destroy: () => {
      if (modeIndividualRadio) modeIndividualRadio.removeEventListener('change', handleModeChange);
      if (modeGroupRadio) modeGroupRadio.removeEventListener('change', handleModeChange);
      if (adultsSelect) adultsSelect.removeEventListener('change', handleAdultsChange);
      if (childrenSelect) childrenSelect.removeEventListener('change', handleChildrenChange);
      if (childAgesContainer) {
        childAgesContainer.removeEventListener('childAgeChange', handleChildAgeChange as EventListener);
      }
      if (checkInInput) checkInInput.removeEventListener('change', handleDateChange);
      if (checkOutInput) checkOutInput.removeEventListener('change', handleDateChange);
      if (vehicleTypeSelect) vehicleTypeSelect.removeEventListener('change', handleVehicleTypeChange);
      if (vehiclePlateInput) vehiclePlateInput.removeEventListener('input', handleVehiclePlateChange);
      if (specialRequestsTextarea) specialRequestsTextarea.removeEventListener('input', handleSpecialRequestsChange);
      formElement.removeEventListener('submit', handleSubmit);
    }
  };
}
