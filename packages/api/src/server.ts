import { ApolloServer } from 'apollo-server'
import typeDefs from './typeDefs'
import { DIRECTIVES } from '@graphql-codegen/typescript-mongodb'
import resolvers from './resolvers'
import { Loaders } from './loaders'
import {
  ConfigByFullName,
  FeedInfo,
  Repositories,
  NetworksConfig
} from './types'

export async function createServer (
  repositories: Repositories,
  config: {
    dataFeedsConfig: Array<FeedInfo>
    networksConfig: Array<NetworksConfig>
  }
): Promise<ApolloServer> {
  return new ApolloServer({
    typeDefs: [DIRECTIVES, typeDefs],
    resolvers,
    context: () => {
      const configByFullName: ConfigByFullName = config.dataFeedsConfig.reduce(
        (acc, feedInfo) => ({
          ...acc,
          [`${feedInfo.feedFullName}`]: feedInfo
        }),
        {}
      )

      const loaders = new Loaders(repositories)
      return {
        ...repositories,
        config: {
          feedsConfig: configByFullName,
          networksConfig: config.networksConfig
        },
        loaders: loaders.getLoaders()
      }
    }
  })
}
