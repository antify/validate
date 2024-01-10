# Antify Validate

Use one validation for client and server side.

## Features

- [x] Validation for client and server side
- [x] Validation per field, custom group or all fields
- [x] Validation for nested objects
- [x] Fully typed
- [x] Ships with predefined rules (See [here](https://github.com/antify/validate/tree/main/src/rules))
- [ ] Ships with predefined and translated error messages
- [x] Group able fields and validation rules for different contexts

## Installation

```bash
pnpm i @antify/validate
```

## Usage

```ts
import { validate } from '@antify/validate';

export type Car = {
  id: string | null
  model: string | null
  manufacturer: string | null
  type: string | null
  color: string | null
  engine: {
    type: string | null
    volumeInLiter: number | null
    powerPs: number | null
  }
};

export const validator = useValidator<Car>({
  id: {
    rules: [(val: any) => isTypeOfRule(val, Types.STRING)],
    group: ['client']
  }
})
```

### Client side (Vue example)

```vue

<script lang="ts" scoped>
  import {ref, reference} from 'vue';
  import {validator} from './validator';

  const validatorRef = reference(validator);
  const car = ref({
    id: '1',
    model: null,
    manufacturer: null,
    type: null,
    color: null,
    engine: {
      type: null,
      volumeInLiter: null,
      powerPs: null
    }
  });
  
  function submit() {
    validatorRef.validate(car.value);

    if (validatorRef.hasErrors()) {
      return;
    }

    // submit
  }
</script>

<template>
  <form @submit.prevent="submit">
    <div v-if="validatorRef.hasErrors()">
      There are some errors to fix: <br>
      
      <div style="white-space: pre">{{ validatorRef.getErrorsAsString() }}</div>
    </div>
    
    <div>
      <label>{{ validatorRef.fieldMap.model.readableName }}</label>
      <input v-model="car.model" @blur="validatorRef.fieldMap.model.validate()"/>
      <span v-if="validatorRef.fieldMap.model.hasErrors()">{{ validatorRef.fieldMap.model.getErrors() }}</span>
    </div>
    
    <button>Submit</button>
  </form>
</template>


```

### Server side

```ts
import {validator, type Car} from './validator';

const car: Car = {
  id: '1',
  model: 'A4',
  manufacturer: 'Audi',
  type: 'Sedan',
  color: 'Black',
  engine: {
    type: 'Gasoline',
    volumeInLiter: 2.0,
    powerPs: 150
  }
};

const validatedData = validator.validate(car);

if (validator.hasErrors()) {
  throw new Error(validator.getErrorsAsString());
}

// Save data
```

## Development

- Run `pnpm dev` to generate type stubs.
- Use `pnpm dev` to start tests in watch mode for development.
