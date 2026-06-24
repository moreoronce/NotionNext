/**
 * GEO / AI search optimization
 */
module.exports = {
  // Generate /llms.txt to give LLM crawlers and agents a concise site map.
  LLMS_TXT_ENABLED: process.env.NEXT_PUBLIC_LLMS_TXT_ENABLED ?? true,
  LLMS_TXT_POST_LIMIT: process.env.NEXT_PUBLIC_LLMS_TXT_POST_LIMIT || 80,
  LLMS_TXT_INCLUDE_PAGES:
    process.env.NEXT_PUBLIC_LLMS_TXT_INCLUDE_PAGES ?? true,
  LLMS_TXT_SITE_SUMMARY: process.env.NEXT_PUBLIC_LLMS_TXT_SITE_SUMMARY || '',

  // Explicit crawler policy used in robots.txt. Keep search and answer engines
  // discoverable by default; set GEO_AI_TRAINING_ENABLED=false to opt out of
  // training-oriented crawlers without blocking AI search surfaces.
  GEO_AI_SEARCH_ENABLED: process.env.NEXT_PUBLIC_GEO_AI_SEARCH_ENABLED ?? true,
  GEO_AI_TRAINING_ENABLED:
    process.env.NEXT_PUBLIC_GEO_AI_TRAINING_ENABLED ?? true,
  GEO_CRAWL_DELAY: process.env.NEXT_PUBLIC_GEO_CRAWL_DELAY || '',
  GEO_REGION: process.env.NEXT_PUBLIC_GEO_REGION || 'CN',
  GEO_COUNTRY: process.env.NEXT_PUBLIC_GEO_COUNTRY || 'CN',
  GEO_PLACENAME: process.env.NEXT_PUBLIC_GEO_PLACENAME || ''
}
