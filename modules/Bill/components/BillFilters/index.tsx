import React, { useMemo } from 'react'

import { Select } from '@Components/Select'
import { useForm } from 'react-hook-form'
import { Flex, Spacer, Box } from '@chakra-ui/react'

type BillFiltersType = {
  year?: number,
  month?: number,
}

interface BillFiltersProps {
  filters?: BillFiltersType,
  onChange: Function,
  from: number,
  to: number
}

const MONTHS_DICT = {
  0: 'Janeiro',
  1: 'Fevereiro',
  2: 'Março',
  3: 'Abril',
  4: 'Maio',
  5: 'Junho',
  6: 'Julho',
  7: 'Agosto',
  8: 'Setembro',
  9: 'Outubro',
  10: 'Novembro',
  11: 'Dezembro',
}

const BillFilters = ({ filters, onChange, from, to }: BillFiltersProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm();

  const years = useMemo(() => {
    const finalYears = []

    if (from > to) {
      throw new Error('From must be lower than to')
    }
    
    if (to - from <= 0) {
      throw new Error('To minus from must be over 0')
    }

    for (let yearCount = 0; yearCount <= to - from; yearCount++) {
      finalYears.push({
        label: `${from + yearCount}`,
        to: from + yearCount
      })
    }

    return finalYears
  }, [from, to])

  const months = useMemo(() => {
    let startMonth = 0;
    const currentDate = new Date();
    const finalMonths = [];

    // Business Rule: If you want to filter 
    // if (currentDate.getFullYear() === filters.year) {
    //   startMonth = currentDate.getMonth();
    // }

    for (let monthCount = 0; monthCount <= 11; monthCount++) {
      finalMonths.push({
        label: `${MONTHS_DICT[monthCount]}`,
        value: monthCount
      })      
    }

    return finalMonths
  }, [filters.year])

  console.log(filters.year)

  return (
    <Box marginBottom="10px"  borderWidth="1px" borderRadius="lg">
      <form>
        <Flex p="2" alignItems="flex-end">
          <Select
            name="year"
            label="Year"
            value={filters?.year}
            options={years}
            {...register('year')}
            onChange={(select) => onChange('year', +select.target.value)}
            error={errors.year?.message}
            flex="3"
          />

          <Spacer />

          <Select
            name="month"
            label="Months"
            value={filters?.month}
            options={months}
            {...register('month')}
            onChange={(select) => onChange('month', +select.target.value)}
            error={errors.month?.message}
            flex="3"
          />
        </Flex>
      </form>
    </Box>
  )
}

export default BillFilters;
