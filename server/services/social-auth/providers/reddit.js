import config from '../../../config'

export default {
  id: 'reddit',
  name: 'Reddit',
  type: 'oauth',
  version: '2.0',
  scope: 'identity',
  params: { grant_type: 'authorization_code' },
  accessTokenUrl: ' https://www.reddit.com/api/v1/access_token',
  authorizationUrl:
    'https://www.reddit.com/api/v1/authorize?response_type=code',
  profileUrl: 'https://oauth.reddit.com/api/v1/me',
  profile: profile => {
    return {
      id: profile.id,
      name: profile.name,
      image: null,
      email: profile.email || `${profile.id}@reddit.com`
    }
  },
  clientId: config.get('REDDIT_CLIENT_ID'),
  clientSecret: config.get('REDDIT_CLIENT_SECRET')
}
