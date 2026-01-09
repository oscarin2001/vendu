import React from "react";

interface AUPContentProps {
  companyName?: string;
}

export function AUPContent({ companyName }: AUPContentProps) {
  const company = companyName || "[NOMBRE_DE_LA_EMPRESA]";

  return (
    <div className="prose max-w-none">
      <h1>Política de Uso Aceptable (AUP) de {company}</h1>

      <h2>1. ¿Por qué existe esta política?</h2>
      <p>
        Esta política explica qué puedes hacer y qué no en la plataforma.
        Queremos que todos los usuarios estén seguros y que no haya problemas.
        La plataforma está hecha para ayudar a vender productos de segunda mano
        y en mercados locales.
      </p>

      <h2>2. ¿Qué no puedes hacer? (Ejemplos)</h2>
      <ul>
        <li>
          No puedes vender productos robados, falsos, drogas, armas o cosas
          peligrosas.
        </li>
        <li>
          No uses la plataforma para lavar dinero, evadir impuestos o hacer
          fraudes.
        </li>
        <li>No publiques contenido que incite a la violencia o al delito.</li>
      </ul>

      <h2>3. ¿Qué sí puedes publicar? (Ejemplos)</h2>
      <ul>
        <li>
          Ropa usada, accesorios, repuestos, electrónicos, comida y otros
          productos de segunda mano.
        </li>
        <li>
          Si quieres vender otras cosas, pide permiso al equipo de la plataforma
          primero.
        </li>
      </ul>

      <h2>4. ¿Qué pasa si no sigues las reglas?</h2>
      <ul>
        <li>
          Podemos limitar, pausar o borrar tu cuenta y tus productos sin avisar.
        </li>
        <li>
          En casos graves, cerraremos tu cuenta y ayudaremos a las autoridades.
        </li>
      </ul>

      <h2>5. ¿Cómo reportar algo sospechoso?</h2>
      <ul>
        <li>
          Cualquier usuario puede reportar productos o cuentas sospechosas
          usando el formulario de denuncias o enviando un email a
          abuse@empresa.com.
        </li>
        <li>Revisaremos el reporte en 24 a 72 horas.</li>
      </ul>

      <h2>6. Verificación y límites</h2>
      <ul>
        <li>
          Podemos pedirte documentos extra si vendes mucho o si hay riesgos.
        </li>
        <li>
          Si no te verificas, no podrás vender, retirar dinero o usar funciones
          avanzadas.
        </li>
      </ul>

      <h2>7. Registros que guardamos</h2>
      <p>
        Guardamos registros de tus actividades para nuestro uso interno y para
        ayudar a las autoridades si es necesario.
      </p>

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
