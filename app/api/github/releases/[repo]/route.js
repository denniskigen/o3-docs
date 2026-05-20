const cache = new Map()
const CACHE_TTL = 3600 * 1000
const STALE_CACHE_TTL = 24 * 3600 * 1000

function getCachedData(repo) {
  const cached = cache.get(repo)
  if (!cached) return null
  const age = Date.now() - cached.timestamp
  if (age < CACHE_TTL) return cached.data
  if (age < STALE_CACHE_TTL) return { ...cached.data, _stale: true }
  cache.delete(repo)
  return null
}

function setCachedData(repo, data) {
  cache.set(repo, { data, timestamp: Date.now() })
}

export async function GET(request, { params }) {
  const { repo } = await params

  if (!repo) {
    return Response.json({ error: 'Repository name is required' }, { status: 400 })
  }

  const cachedData = getCachedData(repo)
  if (cachedData && !cachedData._stale) {
    return Response.json(cachedData, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  }

  try {
    const response = await fetch(`https://api.github.com/repos/openmrs/${repo}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github.v3+json',
        'User-Agent': 'OpenMRS-O3-Docs',
      },
    })

    if (response.status === 403) {
      const remaining = response.headers.get('x-ratelimit-remaining')
      const reset = response.headers.get('x-ratelimit-reset')
      if (remaining === '0') {
        if (cachedData?._stale) {
          return Response.json(cachedData, {
            headers: {
              'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
              'X-Cache-Status': 'STALE',
            },
          })
        }
        return Response.json(
          {
            error: 'RATE_LIMIT',
            message: 'GitHub API rate limit exceeded',
            rateLimitReset: reset ? new Date(parseInt(reset) * 1000).toISOString() : null,
          },
          { status: 429 }
        )
      }
    }

    if (!response.ok) {
      if (cachedData?._stale) {
        return Response.json(cachedData, {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
            'X-Cache-Status': 'STALE',
          },
        })
      }
      return Response.json(
        { error: 'GITHUB_API_ERROR', message: `Failed to fetch releases for ${repo}`, status: response.status },
        { status: response.status }
      )
    }

    const data = await response.json()
    setCachedData(repo, data)
    return Response.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    })
  } catch (error) {
    if (cachedData?._stale) {
      return Response.json(cachedData, {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=86400',
          'X-Cache-Status': 'STALE',
        },
      })
    }
    console.error(`Error fetching GitHub release for ${repo}:`, error)
    return Response.json({ error: 'INTERNAL_ERROR', message: 'An error occurred while fetching the release' }, { status: 500 })
  }
}
