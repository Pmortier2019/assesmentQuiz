"use client";

import { LegalShell } from "@/components/layout/LegalShell";
import { useT } from "@/lib/i18n";

function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="font-display text-xl font-semibold text-default mt-2">{children}</h2>;
}

export default function TermsPage() {
  const { locale } = useT();
  const nl = locale === "nl";

  return (
    <LegalShell
      title={nl ? "Algemene voorwaarden" : "Terms of Service"}
      lastUpdated={nl ? "Laatst bijgewerkt: 8 juni 2026" : "Last updated: 8 June 2026"}
    >
      {nl ? (
        <>
          <p>
            Welkom bij Ready to Ace (&ldquo;de Dienst&rdquo;). Door een account aan te maken of de
            Dienst te gebruiken, ga je akkoord met deze algemene voorwaarden. Lees ze
            zorgvuldig door.
          </p>

          <H2>1. De dienst</H2>
          <p>
            Ready to Ace biedt online oefentests en voorbereidingsmateriaal voor
            psychometrische assessments. De Dienst is uitsluitend bedoeld voor oefen- en
            voorbereidingsdoeleinden.
          </p>

          <H2>2. Account</H2>
          <p>
            Je bent verantwoordelijk voor het geheimhouden van je inloggegevens en voor alle
            activiteiten onder je account. Geef bij registratie correcte informatie op. Je moet
            minstens 16 jaar oud zijn om een account aan te maken.
          </p>

          <H2>3. Gratis en betaalde abonnementen</H2>
          <p>
            Een gratis account geeft toegang tot een beperkt aantal tests. Het Pro-abonnement
            geeft onbeperkte toegang en wordt afgehandeld via onze betaalpartner LemonSqueezy.
            Betalingen zijn periodiek (maandelijks) en worden automatisch verlengd tot je
            opzegt. Je kunt op elk moment opzeggen via je account; toegang loopt dan door tot
            het einde van de betaalde periode.
          </p>

          <H2>4. Toegestaan gebruik</H2>
          <p>
            Je mag de Dienst niet misbruiken: geen geautomatiseerd scrapen, geen pogingen tot
            ongeautoriseerde toegang, geen herverkoop of herdistributie van de inhoud, en geen
            gebruik dat de Dienst verstoort. Alle test- en oefeninhoud is ons intellectueel
            eigendom.
          </p>

          <H2>5. Geen garantie op resultaten</H2>
          <p>
            Ready to Ace is een oefenplatform. We geven geen enkele garantie dat het gebruik van
            de Dienst leidt tot het slagen voor een echt assessment, een sollicitatie of een
            baan. Onze content is een benadering van veelvoorkomende assessmenttypes en is niet
            verbonden aan een specifieke werkgever of testaanbieder.
          </p>

          <H2>6. Aansprakelijkheid</H2>
          <p>
            De Dienst wordt aangeboden &ldquo;zoals deze is&rdquo;. Voor zover wettelijk
            toegestaan zijn wij niet aansprakelijk voor indirecte of gevolgschade die voortvloeit
            uit het gebruik van de Dienst.
          </p>

          <H2>7. Beëindiging</H2>
          <p>
            Je kunt je account op elk moment verwijderen via Instellingen. Wij kunnen accounts
            opschorten of beëindigen bij schending van deze voorwaarden.
          </p>

          <H2>8. Wijzigingen</H2>
          <p>
            We kunnen deze voorwaarden van tijd tot tijd bijwerken. Bij belangrijke wijzigingen
            informeren we je via de Dienst of per e-mail.
          </p>

          <H2>9. Contact</H2>
          <p>
            Vragen over deze voorwaarden? Neem contact op via support@ready-to-ace.com.
          </p>
        </>
      ) : (
        <>
          <p>
            Welcome to Ready to Ace (&ldquo;the Service&rdquo;). By creating an account or using
            the Service, you agree to these Terms of Service. Please read them carefully.
          </p>

          <H2>1. The service</H2>
          <p>
            Ready to Ace provides online practice tests and preparation material for
            psychometric assessments. The Service is intended solely for practice and
            preparation purposes.
          </p>

          <H2>2. Your account</H2>
          <p>
            You are responsible for keeping your credentials confidential and for all activity
            under your account. Provide accurate information when registering. You must be at
            least 16 years old to create an account.
          </p>

          <H2>3. Free and paid plans</H2>
          <p>
            A free account grants access to a limited number of tests. The Pro subscription
            unlocks unlimited access and is processed by our payment partner LemonSqueezy.
            Payments are recurring (monthly) and renew automatically until you cancel. You can
            cancel at any time from your account; access continues until the end of the paid
            period.
          </p>

          <H2>4. Acceptable use</H2>
          <p>
            You may not misuse the Service: no automated scraping, no attempts at unauthorized
            access, no resale or redistribution of the content, and no use that disrupts the
            Service. All test and practice content is our intellectual property.
          </p>

          <H2>5. No guarantee of results</H2>
          <p>
            Ready to Ace is a practice platform. We make no guarantee that using the Service
            will result in passing a real assessment, application, or job. Our content
            approximates common assessment types and is not affiliated with any specific
            employer or test provider.
          </p>

          <H2>6. Liability</H2>
          <p>
            The Service is provided &ldquo;as is&rdquo;. To the extent permitted by law, we are
            not liable for any indirect or consequential damages arising from your use of the
            Service.
          </p>

          <H2>7. Termination</H2>
          <p>
            You can delete your account at any time from Settings. We may suspend or terminate
            accounts that violate these Terms.
          </p>

          <H2>8. Changes</H2>
          <p>
            We may update these Terms from time to time. For material changes we will notify you
            through the Service or by email.
          </p>

          <H2>9. Contact</H2>
          <p>Questions about these Terms? Contact us at support@ready-to-ace.com.</p>
        </>
      )}
    </LegalShell>
  );
}
