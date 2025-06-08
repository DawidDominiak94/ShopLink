export const useUnitComposable = () => 
{
  const getUnits = () : Array<{ value: string; label: string }> => {
    // Zwraca listę jednostek miary
    // Możesz dodać więcej jednostek lub zmienić istniejące
    // np. { value: 'szt.', label: 'szt.' } dla sztuk

    return [
      { value: 'szt.', label: 'szt.' },
      { value: 'kg', label: 'kg' },
      { value: 'l', label: 'l' },
      { value: 'g', label: 'g' },
      { value: 'ml', label: 'ml' },
      { value: 'opak.', label: 'opak.' },
      { value: 'pudeł.', label: 'pudeł.' },
      { value: 'butel.', label: 'butel.' },
      { value: 'puszka', label: 'puszka' },
      { value: 'torba', label: 'torba' },
      { value: 'inne', label: 'inne' } // domyślna jednostka
    ]
  }

  return {
    getUnits
  };
}
