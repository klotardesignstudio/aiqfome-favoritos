import { InMemoryUserRepository } from '../infrastructure/persistence/InMemoryUserRepository';
import { ScryptPasswordHasher } from '../infrastructure/crypto/ScryptPasswordHasher';
import { HmacTokenService } from '../infrastructure/auth/HmacTokenService';
import { CreateUser } from '../application/usecases/CreateUser';
import { AuthenticateUser } from '../application/usecases/AuthenticateUser';
import { InMemoryFavoriteRepository } from '../infrastructure/persistence/InMemoryFavoriteRepository';
import { AddFavorite } from '../application/usecases/favorites/AddFavorite';
import { ListFavorites } from '../application/usecases/favorites/ListFavorites';
import { RemoveFavorite } from '../application/usecases/favorites/RemoveFavorite';
import { FakeStoreProductCatalog } from '../infrastructure/catalog/FakeStoreProductCatalog';

const userRepository = new InMemoryUserRepository();
const passwordHasher = new ScryptPasswordHasher();
const tokenService = new HmacTokenService();

const favoritesRepository = new InMemoryFavoriteRepository();

const createUser = new CreateUser({ repo: userRepository, hasher: passwordHasher });
const authenticateUser = new AuthenticateUser({ repo: userRepository, hasher: passwordHasher, tokens: tokenService });

const addFavorite = new AddFavorite(favoritesRepository);
const listFavorites = new ListFavorites(favoritesRepository);
const removeFavorite = new RemoveFavorite(favoritesRepository);

const catalog = new FakeStoreProductCatalog();

export const container = {
  userRepository,
  passwordHasher,
  tokenService,
  favoritesRepository,
  catalog,
  usecases: {
    createUser,
    authenticateUser,
    addFavorite,
    listFavorites,
    removeFavorite,
  },
};
