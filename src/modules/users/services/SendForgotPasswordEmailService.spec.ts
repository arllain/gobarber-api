import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersReposistory';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensReposistory';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeMailProvider: FakeMailProvider;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakeUsersRepository.create({
      name: 'Dev',
      email: 'dev@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'dev@gmail.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to recover a non-existing user passworr', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'dev@gmail.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('shoul generate a forgotten password token', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Dev',
      email: 'dev@gmail.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'dev@gmail.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});
