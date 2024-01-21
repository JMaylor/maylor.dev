# Vue 3.3 - Generically Typed SFCs.

Vue 3 continues to provide excellent type support, and since v3.3, we've been able to use generic types our component definitions. Let's dive in and see how this works, and what benefits it can bring.

## Getting Started

We're going to create a Select component using the [headlessUI Listbox](https://headlessui.com/vue/listbox).

If you want to skip setting up the basic project and installing dependencies, you can grab the starter code from the `starter` branch [here](https://github.com/JMaylor/vue-type-generics/tree/starter) and [skip to the next section](#creating-a-select-component).

Firstly, I'm going to create a new Vue 3 + Vite project.

:::code-group
```bash [pnpm]
pnpm create vue@latest vue-type-generics && cd vue-type-generics
```
```bash [npm]
npm create vue@latest vue-type-generics && cd vue-type-generics
```
```bash [yarn]
yarn create vue@latest vue-type-generics && cd vue-type-generics
```
:::

And select the following options:

```bash
√ Add TypeScript? Yes
√ Add JSX Support? No
√ Add Vue Router? No
√ Add Pinia? No
√ Add Vitest? No
√ Add an End-to-End Testing Solution? No
√ Add ESLint for code quality? Yes
√ Add Prettier for code formatting? No
```

We'll also install headlessUI and tailwindcss:

:::code-group
```bash [pnpm]
pnpm add @headlessui/vue
pnpm add -D tailwindcss postcss autoprefixer
```
```bash [npm]
npm install @headlessui/vue
npm install -D tailwindcss postcss autoprefixer
```
```bash [yarn]
yarn add @headlessui/vue
yarn add -D tailwindcss postcss autoprefixer
```
:::

To [configure tailwindcss](https://tailwindcss.com/docs/guides/vite#vue):

:::code-group
```bash [pnpm]
pnpm dlx tailwindcss init -p
```
```bash [npm]
npx tailwindcss init -p
```
```bash [yarn]
yarn tailwindcss init -p
```
:::

<!-- eslint-skip -->
```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [], // [!code --]
  content: [ // [!code ++]
    './index.html', // [!code ++]
    './src/**/*.{vue,js,ts,jsx,tsx}', // [!code ++]
  ], // [!code ++]
  theme: {
    extend: {},
  },
  plugins: [],
}
```
```css
/* src/assets/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Your package.json should look something like this:

```json
{
  "name": "vue-type-generics",
  "version": "0.0.0",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check build-only",
    "preview": "vite preview",
    "build-only": "vite build",
    "type-check": "vue-tsc --noEmit",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
  },
  "dependencies": {
    "@headlessui/vue": "^1.7.13", // [!code ++]
    "vue": "^3.2.47" // [!code --]
    "vue": "^3.3.0-beta.3" // [!code ++]
  },
  "devDependencies": {
    "@rushstack/eslint-patch": "^1.2.0",
    "@tsconfig/node18": "^2.0.0",
    "@types/node": "^18.16.3",
    "@vitejs/plugin-vue": "^4.2.1",
    "@vue/eslint-config-typescript": "^11.0.3",
    "@vue/tsconfig": "^0.3.2",
    "autoprefixer": "^10.4.14", // [!code ++]
    "eslint": "^8.39.0",
    "eslint-plugin-vue": "^9.11.0",
    "npm-run-all": "^4.1.5",
    "postcss": "^8.4.23", // [!code ++]
    "tailwindcss": "^3.3.2", // [!code ++]
    "typescript": "~5.0.4",
    "vite": "^4.3.4",
    "vue-tsc": "^1.6.4"
  }
}
```

We can remove everything in the `src/components`, as well as `src/assets/base.css` and `src/assets/logo.svg`. Finally, we can change the content of `src/App.vue` to simply:

```vue
<script setup lang="ts">
</script>

<template>
  <main>Hello, Vue 3.3 TS Generic Components!</main>
</template>
```

## Creating a Select Component

Let's go ahead and create our component in `src/components/VSelect.vue` with the following starter code, which is mostly taken from the [headlessUI docs](https://headlessui.com/vue/listbox). I've added basic styling and added some props to make it broadly reusable.

```vue
<script setup lang="ts">
import {
  Listbox,
  ListboxLabel,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue'
import { computed } from 'vue';

const props = defineProps<{
  /**
   * modelValue to implement a two-way binding
   * see https://vuejs.org/guide/components/v-model.html
   */
  modelValue: any

  /**
   * label for the input
   */
  label: string

  /**
   * list of available items
   */
  items: any[]

  /**
   * key to use to get the underlying value from a provided object
   * see valueFn
   */
  valueKey: string

  /**
   * key to use to get the display text from a provided object
   * see displayFn
   */
  displayKey: string
}>()

defineEmits<{
  (e: 'update:modelValue', value: any): void
}>()

const valueFn = (o: any) => o[props.valueKey]
const displayFn = (o: any) => o[props.displayKey]

/**
 * gets the full selected item, based on the selected value.
 */
const selectedItem = computed(() => props.items.find(i => valueFn(i) === props.modelValue))
</script>

<template>
  <div class="w-72">
    <Listbox @update:model-value="$emit('update:model-value', $event)">
      <ListboxLabel>{{ label }}</ListboxLabel>
      <div class="relative">
        <ListboxButton class="relative w-full border text-left">
          <span class="block truncate">{{ selectedItem ? displayFn(selectedItem) : 'Please Select...' }}</span>
        </ListboxButton>
        <ListboxOptions class="absolute max-h-60 z-10 bg-white w-full overflow-auto py-1 border">
          <ListboxOption v-slot="{ active, selected }" v-for="item in items" :key="String(valueFn(item))"
            :value="valueFn(item)" as="template">
            <li class="relative select-none" :class="{
              'bg-blue-100': active,
              'bg-blue-50': selected && !active
            }">
              <span>{{ displayFn(item) }}</span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </div>
    </Listbox>
  </div>
</template>
```

We can then use this in our `App.vue` like so:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import VSelect from './components/VSelect.vue'

const people = ref([
  {
    id: 1,
    name: 'Frodo',
    age: 50
  },
  {
    id: 2,
    name: 'Gandalf',
    age: 24_000
  }
])

const person = ref()
</script>

<template>
  <main>
    <VSelect v-model="person" :items="people" label="Character" value-key="id" display-key="name" />
  </main>
</template>
```

This works fine, but there are errors that we could potentially introduce in our source code that wouldn't be noticed until runtime. Right now we're having to use `any[]` as the type of our `items` prop. We could be providing users, countries, etc.

This is a problem - suppose we do change our above code by setting the `valueKey` to `person_id` instead. `person_id` is clearly not going to result in anything useful, since our `people` don't have this property! However, TypeScript won't complain and we won't see any issue until we actually use this in the browser.

```vue
<VSelect :items="people" v-model="person" label="Character" value-key="person_id" display-key="name" />
```

## Generics!

So, how can we fix this? You guessed it - by utilising Generics in our `VSelect` component! We want to restrict the `valueKey` to be some key of whatever we provide as the `items` prop.
i.e. if we'd have to provide `id`, `name`, or `age` for our current example.
If we were instead choosing from a list of countries, which had the following interface:

```ts
interface Country {
  country_code: string
  country_name: string
}
```

Then we'd want to restrict `valueKey` to be either `country_code` or `country_name`. The same goes for our `displayKey` prop.

So, let's head back to our `VSelect` component and add this feature:

```vue
<script setup lang="ts"> // [!code --]
<script setup lang="ts" generic="TItem"> // [!code ++]

const props = defineProps<{
  ...
  items: any[] // [!code --]
  items: TItem[] // [!code ++]
  ...
  valueKey: string // [!code --]
  valueKey: keyof TItem // [!code ++]
  ...
  displayKey: string // [!code --]
  displayKey: keyof TItem // [!code ++]
}>()
...
</script>
```

Now, whenever we use this component in our application, TypeScript will look at the `items` we provide, and ensure that `valueKey` and `displayKey` are both keys of the item type! Neat. If we head on over back to `App.vue`, you should now see an error in our template:

```vue
<VSelect
  :items="people"
  v-model="person"
  label="Character"
  value-key="person_id" // [!code error]
  display-key="name"
/>
```
::: danger Error
Type `"person_id"` is not assignable to type `"id" | "name" | "age"`.ts(2322)
:::

Great, now we'll get a warning straight away in our IDE before even switching to the browser and seeing it fail.

But wait, there's more! Currently in `App.vue` we're initialising `person` as `ref()`, which gives it an inferred type of `Ref<any>`. In a larger codebase we'd probably have a more precise type than this. If we know we want to capture the id of a user, then we'd want to ensure this has a type of `Ref<number`> instead. So let's change this by altering the declaration to the following:

```ts
const person = ref() // [!code --]
const person = ref<number>() // [!code ++]
```

Now, this introduces another way we can improve the restrictions on our `valueKey` props. TypeScript would have no problem with us currently setting the `valueKey` as `name`. But there definitely is something wrong with this! The `name` property of our people is of type `string`, not `number`.

So, ideally we want to further restrict our `valueKey` to only allow keys where the type of that property returns the same type as `modelValue`.

Firstly, let's add an additional generic type, `TValue` to our `VSelect` component, which will be type of the `modelValue` prop.

```vue
<script setup lang="ts" generic="TItem"> // [!code --]
<script setup lang="ts" generic="TValue, TItem"> // [!code ++]
...
const props = defineProps<{
  /**
   * modelValue to implement a two-way binding
   * see https://vuejs.org/guide/components/v-model.html
   */
  modelValue: any // [!code --]
  modelValue: TValue // [!code ++]
  ...
}>()
...
</script>
```

Now, to enrich the typing of our `valueKey` property, we need to find all the keys of `TItem` which have type `TValue`. Credit to [this SO answer](https://stackoverflow.com/a/49752227) for this nice `KeyOfType` utility.

```vue
<script setup lang="ts" generic="TValue, TItem">
...
type KeyOfType<T, V> = keyof { // [!code ++]
  [P in keyof T as T[P] extends V ? P : never]: any // [!code ++]
} // [!code ++]

const props = defineProps<{
  ...
  valueKey: keyof TItem // [!code --]
  valueKey: KeyOfType<TItem, TValue> // [!code ++]
  ...
}>()
...
...
</script>
```

Now, if we go back to `App.vue` and try to use `name` as our `valueKey`, we get an error! We're now only allowed to use `id` or `age`, since these are the only numerical properties.

```vue
<VSelect
  :items="people"
  v-model="person"
  label="Character"
  value-key="name" // [!code error]
  display-key="name"
/>
```
::: danger Error
Type `"name"` is not assignable to type `"id" | "age"`.ts(2322)
:::

Back in our `VSelect.vue`, we can only stop using `any` types for our `valueFn` and `displayFn`, since we now know they'll be of type `TItem`.

```ts
const valueFn = (o: any) => o[props.valueKey] // [!code --]
const displayFn = (o: any) => o[props.displayKey] // [!code --]
const valueFn = (o: TItem) => o[props.valueKey] as TValue // [!code ++]
const displayFn = (o: TItem) => o[props.displayKey] // [!code ++]
```

We can also specify that our `update:modelValue` emit will emit a `TValue` type, not `any`:

```ts
defineEmits<{
  (e: 'update:modelValue', value: any): void // [!code --]
  (e: 'update:modelValue', value: TValue): void // [!code ++]
}>()
```

We'll have one TS error in our component, specifically on our headlessUI's `ListboxOption`. Luckily, it gives us a very clear error:

::: danger Error
Type 'TValue' is not assignable to type `string | number | boolean | object | null | undefined`.ts(2322)

VSelect.vue: This type parameter might need an `extends string | number | boolean | object | null | undefined` constraint.
:::

It tells us we need to add an `extends` constraint, so let's do that:

```vue
<script setup lang="ts" generic="TValue, TItem"> // [!code --]
<script setup lang="ts" generic="TValue extends string | number | boolean | object | null | undefined, TItem"> // [!code ++]
...
</script>
```

And there we have it, a type-safe, extendable Select component in Vue 3.3, utilising generically typed components!
You can find the full source code on the `blog-final` branch [here](https://github.com/JMaylor/vue-type-generics/tree/blog-final).

If you're interested in seeing more complex examples, check out the `master` branch [here](https://github.com/JMaylor/vue-type-generics) with additional components, typing and props for customisation. You can see some of the deployed components at https://lucent-faloodeh-db7134.netlify.app/

For further reading on TypeScript Generics, see
https://www.typescriptlang.org/docs/handbook/2/generics.html

And, the Vue RFC can be found here
https://github.com/vuejs/rfcs/discussions/436
