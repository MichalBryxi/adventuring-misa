import type { TOC } from '@ember/component/template-only';

const formatter = new Intl.DateTimeFormat('en-GB', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  // The prerender runs in UTC; this keeps the browser from showing another day
  timeZone: 'UTC',
});

const format = (date: string) => formatter.format(new Date(date));

export const FormattedDate: TOC<{
  Element: HTMLTimeElement;
  Args: { date: string };
}> = <template>
  <time datetime={{@date}} ...attributes>{{format @date}}</time>
</template>;
