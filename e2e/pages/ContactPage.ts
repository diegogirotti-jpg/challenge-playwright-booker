import { type Locator, type Page } from "@playwright/test";

export interface ContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

// Selectores verificados en el navegador el 2026-10-30 (specs/challenge-plan.md, sección 1.9).
// El label "Message" apunta a for="message", pero el textarea tiene id="description",
// por eso se usan ids en vez de getByLabel.
export class ContactPage {
  readonly section: Locator;
  readonly heading: Locator;
  readonly name: Locator;
  readonly email: Locator;
  readonly phone: Locator;
  readonly subject: Locator;
  readonly message: Locator;
  readonly submitButton: Locator;

  constructor(private readonly page: Page) {
    this.section = page.locator("#contact");
    this.heading = page.getByRole("heading", { name: "Send Us a Message" });
    this.name = page.locator("#name");
    this.email = page.locator("#email");
    this.phone = page.locator("#phone");
    this.subject = page.locator("#subject");
    this.message = page.locator("#description");
    this.submitButton = page.getByRole("button", { name: "Submit" });
  }

  async goto() {
    await this.page.goto("/#contact");
    await this.heading.waitFor();
  }

  async fill(data: ContactData) {
    await this.name.fill(data.name);
    await this.email.fill(data.email);
    await this.phone.fill(data.phone);
    await this.subject.fill(data.subject);
    await this.message.fill(data.message);
  }

  // Confirmación observada el 2026-10-30 tras un envío real autorizado.
  confirmationHeading(name: string): Locator {
    return this.section.getByRole("heading", { name: `Thanks for getting in touch ${name}!` });
  }

  async submit() {
    await this.submitButton.click();
  }
}
