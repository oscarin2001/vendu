import React from "react";

interface TermsContentProps {
  companyName?: string;
}

export function TermsContent({ companyName }: TermsContentProps) {
  const company = companyName || "[NOMBRE_DE_LA_EMPRESA]";

  return (
    <div className="prose max-w-none">
      <h1>Términos de Uso de {company}</h1>
      <p>
        <strong>Fecha de inicio:</strong> 2026-01-07
      </p>

      <h2>1. Aceptación de los Términos</h2>
      <p>
        Cuando uses esta plataforma, aceptas estos Términos de Uso y la Política
        de Uso Aceptable. Si no estás de acuerdo con ellos, por favor no uses la
        plataforma. Es importante que leas todo antes de continuar.
      </p>

      <h2>2. ¿Para qué sirve esta plataforma?</h2>
      <p>
        Esta plataforma es una herramienta en línea que ayuda a gestionar
        tiendas pequeñas, especialmente las que venden productos de segunda mano
        y en mercados locales. Te permite organizar tu inventario (los productos
        que tienes), hacer ventas, manejar relaciones con clientes y ver
        reportes de cómo va tu negocio.
      </p>

      <h2>3. ¿Qué responsabilidades tienes como usuario?</h2>
      <ul>
        <li>
          Debes dar información verdadera sobre ti, como tu nombre, teléfono,
          descripción de tu negocio y documentos. Todo debe ser real y
          actualizado.
        </li>
        <li>
          No puedes vender productos ilegales, robados, falsos o peligrosos. Si
          lo haces, puedes tener problemas legales.
        </li>
        <li>
          Eres responsable de seguir las leyes de tu país, como las reglas de
          impuestos, aduanas y otras normas.
        </li>
      </ul>

      <h2>4. ¿Qué no cubre la plataforma?</h2>
      <ul>
        <li>
          La plataforma se da "como está". No garantizamos que los productos que
          vendan otros usuarios sean legales o seguros.
        </li>
        <li>
          No somos responsables si hay multas, pérdidas de dinero o problemas
          por usar la plataforma.
        </li>
        <li>
          Si hay un problema de seguridad, haremos lo posible para proteger tus
          datos, pero no podemos garantizar que nunca pase nada.
        </li>
      </ul>

      <h2>5. ¿Cuándo podemos suspender tu cuenta?</h2>
      <ul>
        <li>
          Podemos pausar o cerrar tu cuenta si vemos señales de actividades
          ilegales, si hay una orden judicial, riesgos de seguridad o si no
          sigues estos términos.
        </li>
        <li>
          Si alguien reporta algo sospechoso sobre ti, podemos bloquear tu
          cuenta mientras investigamos.
        </li>
      </ul>

      <h2>6. Riesgos que aceptas</h2>
      <ul>
        <li>
          Entiendes que usar la plataforma puede tener riesgos, como perder
          acceso a tu cuenta si no sigues las reglas o si hay acciones legales.
        </li>
        <li>
          Aceptas que no somos responsables por productos que cargues, pérdidas
          o problemas legales externos.
        </li>
      </ul>

      <h2>7. Indemnización</h2>
      <p>
        Si causas problemas usando la plataforma y violas estos términos, debes
        pagar cualquier gasto o daño que cause.
      </p>

      <h2>8. Leyes que aplican</h2>
      <p>
        Estos términos siguen las leyes del país donde está la empresa.
        Cualquier problema se resolverá en los tribunales de ese lugar.
      </p>

      <h2>9. Contacto</h2>
      <p>Para preguntas legales o reportes: legal@empresa.com</p>

      <hr />
      <p>
        <em>
          Nota: Este es un documento de ejemplo. Te recomendamos que lo revises
          con un abogado local antes de usarlo.
        </em>
      </p>
    </div>
  );
}
