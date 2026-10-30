import { test, expect } from "@playwright/test";
import { ContactPage, type ContactData } from "./pages/ContactPage";

// Datos ficticios identificables como prueba. Los largos de asunto/mensaje y el formato
// del teléfono siguen PENDIENTES (A-001); se usan valores conservadores.
function buildContactData(): ContactData {
  const ts = Date.now();
  return {
    name: `QA Autotest ${ts}`,
    email: `qa+${ts}@example.com`,
    phone: "01234567890",
    subject: `[AUTOTEST] Consulta ${ts}`,
    message: `[AUTOTEST] Mensaje de prueba automatizada ${ts}. Ignorar, no requiere respuesta.`,
  };
}

test.describe("Contacto", () => {
  // TC-003 (OBLIGATORIO). ATENCIÓN: cada ejecución envía un mensaje real a la demo pública
  // (POST /api/message). Ejecutar solo con autorización.
  // Respuesta y confirmación observadas en docs/evidence/tc-003-contact-submission-2026-10-30.md.
  test("TC-003 - contacto válido con envío y confirmación", async ({ page }) => {
    const contactPage = new ContactPage(page);
    const data = buildContactData();

    await contactPage.goto();
    await contactPage.fill(data);

    await expect(contactPage.name).toHaveValue(data.name);
    await expect(contactPage.email).toHaveValue(data.email);
    await expect(contactPage.phone).toHaveValue(data.phone);
    await expect(contactPage.subject).toHaveValue(data.subject);
    await expect(contactPage.message).toHaveValue(data.message);

    const responsePromise = page.waitForResponse(
      (res) => res.url().endsWith("/api/message") && res.request().method() === "POST",
    );
    await contactPage.submit();
    const response = await responsePromise;

    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ success: true });
    expect(response.request().postDataJSON()).toEqual({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      description: data.message,
    });

    await expect(contactPage.confirmationHeading(data.name)).toBeVisible();
    await expect(contactPage.section).toContainText("We'll get back to you about");
    await expect(contactPage.section).toContainText(data.subject);
    await expect(contactPage.section).toContainText("as soon as possible.");
    await expect(contactPage.name).toBeHidden();
  });
});

// TC-001 y TC-002 (OBLIGATORIOS) no se implementan: bloqueados por la página de reserva
// en blanco (GET /api/room/{id} -> 500). Ver docs/bugs/reservation-page-500.md.
