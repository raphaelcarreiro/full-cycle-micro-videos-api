import { CastMember, CastMemberId, CastMemberType } from '../cast-member.entity';

describe('CastMember Entity Unit Tests', () => {
  beforeEach(() => {
    CastMember.prototype.validate = jest.fn().mockImplementation(CastMember.prototype.validate);
  });

  describe('cast_member_id field', () => {
    const arrange = [{ id: null }, { id: undefined }, { id: new CastMemberId() }];

    test.each(arrange)('id is %j', ({ id }) => {
      const category = new CastMember({
        cast_member_id: id as any,
        name: 'Movie',
        type: CastMemberType.actor,
        created_at: new Date(),
      });

      expect(category.cast_member_id).toBeInstanceOf(CastMemberId);
    });
  });

  describe('Create method', () => {
    it('should create a cast member with type actor', () => {
      const validateSpy = jest.spyOn(CastMember.prototype, 'validate');

      const castMember = CastMember.create({
        name: 'John Doe',
        type: CastMemberType.actor,
      });

      expect(validateSpy).toHaveBeenCalled();
      expect(castMember.name).toBe('John Doe');
      expect(castMember.type).toBe(CastMemberType.actor);
      expect(castMember.created_at).toBeInstanceOf(Date);
      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
    });

    it('should create a cast member with type director', () => {
      const validateSpy = jest.spyOn(CastMember.prototype, 'validate');

      const castMember = CastMember.create({
        name: 'John Doe',
        type: CastMemberType.director,
      });

      expect(validateSpy).toHaveBeenCalled();
      expect(castMember.name).toBe('John Doe');
      expect(castMember.type).toBe(CastMemberType.director);
      expect(castMember.created_at).toBeInstanceOf(Date);
      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
    });
  });

  it('should change name', () => {
    const castMember = CastMember.create({
      name: 'John Doe',
      type: CastMemberType.actor,
    });

    const validateSpy = jest.spyOn(castMember, 'validate');

    castMember.changeName('Jane Doe');

    expect(castMember.name).toBe('Jane Doe');
    expect(validateSpy).toHaveBeenCalledTimes(2);
  });

  it('should change type', () => {
    const castMember = CastMember.create({
      name: 'John Doe',
      type: CastMemberType.actor,
    });

    castMember.changeType(CastMemberType.director);

    expect(castMember.type).toBe(CastMemberType.director);
  });

  it('should throw an error when name is null on create method', () => {
    const castMember = CastMember.create({ type: CastMemberType.director } as any);

    expect(castMember.notification).notificationContainsErrorMessages([
      {
        name: ['name must be shorter than or equal to 255 characters'],
      },
    ]);
  });

  it('should throw an error when name property length is bigger then 255 characters', () => {
    const category = CastMember.create({
      name: 'a'.repeat(256),
      type: CastMemberType.actor,
    });

    expect(category.notification.hasErrors()).toBeTruthy();

    expect(category.notification).notificationContainsErrorMessages([
      {
        name: ['name must be shorter than or equal to 255 characters'],
      },
    ]);
  });

  it('should serialize', () => {
    const castMember = CastMember.create({
      name: 'John Doe',
      type: CastMemberType.actor,
    });

    const serialized = castMember.toJSON();

    expect(serialized).toStrictEqual({
      cast_member_id: castMember.cast_member_id.value,
      name: 'John Doe',
      type: CastMemberType.actor,
      created_at: castMember.created_at,
    });
  });
});
