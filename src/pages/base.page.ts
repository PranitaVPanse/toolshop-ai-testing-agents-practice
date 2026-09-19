import type { Page } from '@playwright/test';

/** A locators file exports one factory like this per page. See src/locators/README.md. */
export type LocatorFactory<L> = (page: Page) => L;

/**
 * Base for every page object. A page object holds behaviour only.
 * Its locators come from the matching file in src/locators/, never from inline selectors.
 */
export abstract class BasePage<L> {
  protected readonly loc: L;

  protected constructor(
    protected readonly page: Page,
    locators: LocatorFactory<L>,
    /** Path relative to baseURL, for example '/auth/login'. */
    protected readonly path: string,
  ) {
    this.loc = locators(page);
  }

  async open(): Promise<void> {
    await this.page.goto(this.path);
  }

  /** Exposed so step definitions can assert on elements without duplicating selectors. */
  get locators(): L {
    return this.loc;
  }
}
