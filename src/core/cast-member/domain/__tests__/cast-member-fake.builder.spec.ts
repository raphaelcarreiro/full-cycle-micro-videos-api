import { Chance } from 'chance';
import { CastMemberFakeBuilder } from '../cast-member-fake.builder';
import { CastMemberId, CastMemberType } from '../cast-member.aggregate';

describe('CastMemberFakeBuilder Unit Tests', () => {
  describe('cast_member_id prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.cast_member_id).toThrow(
        new Error("Property cast_member_id not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_cast_member_id']).toBeUndefined();
    });

    test('withCastMemberId', () => {
      const id = new CastMemberId();

      const $this = faker.withCastMemberId(id);

      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_cast_member_id']).toBe(id);

      faker.withCastMemberId(() => id);
      //@ts-expect-error _category_id is a callable
      expect(faker['_cast_member_id']()).toBe(id);

      expect(faker.cast_member_id).toBe(id);
    });

    test('should create CastMember with cast_member_id property using a factory', () => {
      let mockFactory = jest.fn(() => new CastMemberId());

      faker.withCastMemberId(mockFactory);
      faker.build();

      expect(mockFactory).toHaveBeenCalledTimes(1);

      const castMemberId = new CastMemberId();
      mockFactory = jest.fn(() => castMemberId);
      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withCastMemberId(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].cast_member_id).toBe(castMemberId);
      expect(fakerMany.build()[1].cast_member_id).toBe(castMemberId);
    });
  });

  describe('name prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember();
    test('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      const $this = faker.withName('test name');

      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_name']).toBe('test name');

      faker.withName(() => 'test name');
      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe('test name');

      expect(faker.name).toBe('test name');
    });

    test('should pass index to name factory', () => {
      faker.withName(index => `test name ${index}`);
      const category = faker.build();
      expect(category.name).toBe(`test name 0`);

      const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
      fakerMany.withName(index => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name'].length).toBe(256);
      expect(faker['_name']).toBe(tooLong);
    });
  });

  describe('type prop', () => {
    const faker = CastMemberFakeBuilder.aCastMember();
    test('should be a function', () => {
      expect(typeof faker['_type']).toBe('function');
    });

    test('should call the integer method', () => {
      const chance = Chance();

      const spy = jest.spyOn(chance, 'integer');

      faker['chance'] = chance;
      faker.build();

      expect(spy).toHaveBeenCalled();
    });

    test('withType', () => {
      const $this = faker.withType(CastMemberType.actor);

      expect($this).toBeInstanceOf(CastMemberFakeBuilder);
      expect(faker['_type']).toBe(CastMemberType.actor);

      faker.withType(() => CastMemberType.director);
      //@ts-expect-error description is callable
      expect(faker['_type']()).toBe(CastMemberType.director);

      expect(faker.type).toBe(CastMemberType.director);
    });

    describe('created_at prop', () => {
      const faker = CastMemberFakeBuilder.aCastMember();

      test('should throw error when any with methods has called', () => {
        const fakerCategory = CastMemberFakeBuilder.aCastMember();

        expect(() => fakerCategory.created_at).toThrow(
          new Error("Property created_at not have a factory, use 'with' methods"),
        );
      });

      test('should be undefined', () => {
        expect(faker['_created_at']).toBeUndefined();
      });

      test('withCreatedAt', () => {
        const date = new Date();
        const $this = faker.withCreatedAt(date);
        expect($this).toBeInstanceOf(CastMemberFakeBuilder);
        expect(faker['_created_at']).toBe(date);

        faker.withCreatedAt(() => date);
        //@ts-expect-error _created_at is a callable
        expect(faker['_created_at']()).toBe(date);
        expect(faker.created_at).toBe(date);
      });

      test('should pass index to created_at factory', () => {
        const date = new Date();
        faker.withCreatedAt(index => new Date(date.getTime() + index + 2));
        const category = faker.build();
        expect(category.created_at.getTime()).toBe(date.getTime() + 2);

        const fakerMany = CastMemberFakeBuilder.theCastMembers(2);
        fakerMany.withCreatedAt(index => new Date(date.getTime() + index + 2));
        const categories = fakerMany.build();

        expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2);
        expect(categories[1].created_at.getTime()).toBe(date.getTime() + 3);
      });
    });

    test('should create a CastMember', () => {
      const faker = CastMemberFakeBuilder.aCastMember();
      let castMember = faker.build();

      expect(castMember.cast_member_id).toBeInstanceOf(CastMemberId);
      expect(typeof castMember.name === 'string').toBeTruthy();
      expect(typeof castMember.type === 'number').toBeTruthy();
      expect(castMember.created_at).toBeInstanceOf(Date);

      const created_at = new Date();
      const castMemberId = new CastMemberId();

      castMember = faker
        .withCastMemberId(castMemberId)
        .withName('name test')
        .withType(CastMemberType.director)
        .withCreatedAt(created_at)
        .build();

      expect(castMember.cast_member_id.value).toBe(castMemberId.value);
      expect(castMember.name).toBe('name test');
      expect(castMember.type).toBe(CastMemberType.director);
      expect(castMember.created_at).toBe(created_at);
    });

    test('should create many cast members', () => {
      const faker = CastMemberFakeBuilder.theCastMembers(2);
      let castMembers = faker.build();

      castMembers.forEach(item => {
        expect(item.cast_member_id).toBeInstanceOf(CastMemberId);
        expect(typeof item.name === 'string').toBeTruthy();
        expect(typeof item.type === 'number').toBeTruthy();
        expect(item.created_at).toBeInstanceOf(Date);
      });

      const created_at = new Date();
      const castMemberId = new CastMemberId();

      castMembers = faker
        .withCastMemberId(castMemberId)
        .withName('name test')
        .withType(CastMemberType.actor)
        .withCreatedAt(created_at)
        .build();

      castMembers.forEach(item => {
        expect(item.cast_member_id.value).toBe(castMemberId.value);
        expect(item.name).toBe('name test');
        expect(item.type).toBe(CastMemberType.actor);
        expect(item.created_at).toBe(created_at);
      });
    });
  });
});
