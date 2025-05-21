<script lang="ts">
    export let checked = false;
    export let onChange: (val: boolean) => void = () => {};
  </script>
  
  <label class="inline-flex items-center cursor-pointer space-x-2">
    <input
      type="checkbox"
      bind:checked
      class="sr-only peer"
      on:change={() => onChange(checked)}
    />
    <div
      class="w-11 h-6 bg-gray-700 rounded-full relative peer-checked:bg-blue-600 transition"
    >
      <!-- svelte-ignore element_invalid_self_closing_tag -->
      <div
        class="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full transition peer-checked:translate-x-5"
      />
    </div>
    <span class="text-white select-none">Been There</span>
  </label>
  