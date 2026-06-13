import type { CareerTrack } from '../types'
import type { Language } from '../i18n'

const TURKISH_TRACK_LABELS: Record<string, string> = {
  'uscg-candidate': 'USCG Hazırlığı',
  'police-academy-candidate': 'Polis Akademisi',
  'emt-candidate': 'EMT / Acil Tıp Teknisyeni',
  'firefighter-candidate': 'İtfaiyeci',
  'emergency-management-candidate': 'Acil Durum Yönetimi',
  'merchant-mariner-candidate': 'Denizcilik / Ticari Denizci',
  'security-protective-services-candidate': 'Güvenlik / Koruma Hizmetleri',
  'turkiye-career-readiness': 'Türkiye Kariyer Hazırlığı',
}

const TURKISH_CATEGORY_LABELS: Record<string, string> = {
  Administration: 'Yönetim',
  'Academy Readiness': 'Akademi Hazırlığı',
  Application: 'Başvuru',
  Background: 'Geçmiş Kontrolü',
  Certification: 'Sertifika',
  'Clinical Hours': 'Klinik Saatler',
  Communication: 'İletişim',
  Documents: 'Belgeler',
  Education: 'Eğitim',
  Eligibility: 'Uygunluk',
  'Employment Readiness': 'İş Hazırlığı',
  Experience: 'Deneyim',
  Exploration: 'Keşif',
  Fitness: 'Fiziksel Hazırlık',
  Interview: 'Mülakat',
  'Interview Readiness': 'Mülakat Hazırlığı',
  License: 'Lisans',
  Licensing: 'Lisanslama',
  Medical: 'Sağlık',
  Research: 'Araştırma',
  'Safety Training': 'Güvenlik Eğitimi',
  Study: 'Çalışma',
  Testing: 'Sınav',
  Training: 'Eğitim',
  'Credential Research': 'Yeterlilik Araştırması',
}

export function getTrackDisplayName(track: CareerTrack, language: Language): string {
  if (language !== 'tr') return track.title
  return TURKISH_TRACK_LABELS[track.id] ?? track.title
}

export function getCategoryDisplayName(
  category: string,
  language: Language,
): string {
  if (language !== 'tr') return category
  return TURKISH_CATEGORY_LABELS[category] ?? category
}
