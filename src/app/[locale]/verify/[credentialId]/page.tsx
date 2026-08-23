import { getTranslations } from 'next-intl/server';
import { isValidLocale, type Locale } from '@/i18n/config';
import { notFound } from 'next/navigation';
import { StaticPage } from '@/components/layout/static-page';
import { Badge, Card } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase/server';

export default async function VerifyCredentialPage({
  params
}: {
  params: { locale: string; credentialId: string };
}) {
  if (!isValidLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = await getTranslations({ locale, namespace: 'pages.verify' });

  const supabase = createSupabaseServerClient();
  const { data: credential } = await supabase
    .from('credential_public_view')
    .select('*')
    .eq('protected_student_identifier', params.credentialId)
    .maybeSingle();

  return (
    <StaticPage title={t('title')} intro={t('intro')}>
      {!credential ? (
        <Card>
          <p className="text-sm text-navy-600">
            No credential was found for this identifier. Check the link and try again, or contact the issuer.
          </p>
        </Card>
      ) : (
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-navy-900">{credential.certificate_title}</h2>
            <Badge tone={credential.is_revoked ? 'neutral' : 'gold'}>
              {credential.is_revoked ? 'Revoked' : 'Active'}
            </Badge>
          </div>
          <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
            <dt className="text-navy-400">Issuer</dt>
            <dd className="text-navy-900">{credential.issuer}</dd>
            <dt className="text-navy-400">Issue date</dt>
            <dd className="text-navy-900">{credential.issue_date}</dd>
            <dt className="text-navy-400">Credential number</dt>
            <dd className="text-navy-900">{credential.credential_number}</dd>
            <dt className="text-navy-400">Program status</dt>
            <dd className="text-navy-900">{credential.program_status}</dd>
            <dt className="text-navy-400">Authorization status</dt>
            <dd className="text-navy-900">{credential.authorization_status}</dd>
          </dl>
          {credential.external_issuer_url && (
            <p className="mt-4 text-sm text-navy-400">
              This credential is issued externally. Verify directly with the issuer at{' '}
              <a href={credential.external_issuer_url} className="underline">
                {credential.external_issuer_url}
              </a>
              .
            </p>
          )}
        </Card>
      )}
    </StaticPage>
  );
}
