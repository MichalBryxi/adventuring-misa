import type { TOC } from '@ember/component/template-only';

export const Container: TOC<{
  Element: HTMLDivElement;
  Blocks: { default: [] };
}> = <template>
  <div class="lg:px-8" ...attributes>
    <div class="lg:max-w-4xl">
      <div class="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
        {{yield}}
      </div>
    </div>
  </div>
</template>;
