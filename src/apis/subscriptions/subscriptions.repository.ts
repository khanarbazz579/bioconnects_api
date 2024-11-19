import { Subscriptions } from './subscriptions.model';

export const SUBSCRIPTIONS_REPOSITORY = 'SUBSCRIPTIONS_REPOSITORY';

export const SubscriptionsRepository = {
  provide: SUBSCRIPTIONS_REPOSITORY,
  useValue: Subscriptions,
};
