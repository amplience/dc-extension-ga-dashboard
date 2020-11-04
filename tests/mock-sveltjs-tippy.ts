jest.mock('sveltejs-tippy', () => {
  return {
    default: jest.requireActual('sveltejs-tippy'),
  };
});
