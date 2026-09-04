import { redirect } from 'next/navigation';

export default function LegacyParisEighthPage({ params }: { params: { locale: string } }) {
  redirect(`/${params.locale}/ai-high-school/paris`);
}
