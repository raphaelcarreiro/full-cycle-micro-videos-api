import { setupSequelize } from '@core/category/infra/testing/helpers';
import { DataType } from 'sequelize-typescript';
import { CastMemberModel } from '../cast-member.model';
import { CastMember } from '@core/cast-member/domain/cast-member.entity';

describe('CastMemberModel integration tests', () => {
  setupSequelize({ models: [CastMemberModel] });

  test('mapping props', () => {
    const attributes = CastMemberModel.getAttributes();

    const attributesKeys = Object.keys(attributes);

    expect(attributesKeys).toStrictEqual(['cast_member_id', 'name', 'type', 'created_at']);
  });

  test('cast member id attribute', () => {
    const attributes = CastMemberModel.getAttributes();

    const castMemberId = attributes.cast_member_id;

    expect(castMemberId).toMatchObject({
      field: 'cast_member_id',
      fieldName: 'cast_member_id',
      primaryKey: true,
      type: DataType.UUID(),
    });
  });

  test('cast member name attribute', () => {
    const attributes = CastMemberModel.getAttributes();

    const nameAttribute = attributes.name;

    expect(nameAttribute).toMatchObject({
      field: 'name',
      fieldName: 'name',
      allowNull: false,
      type: DataType.STRING(255),
    });
  });

  test('cast member type attribute', () => {
    const attributes = CastMemberModel.getAttributes();

    const descriptionAttribute = attributes.type;

    expect(descriptionAttribute).toMatchObject({
      field: 'type',
      fieldName: 'type',
      allowNull: false,
      type: DataType.TINYINT(),
    });
  });

  it('should create a cast member', async () => {
    const entity = CastMember.fake().aCastMember().build();

    await CastMemberModel.create({
      cast_member_id: entity.cast_member_id.value,
      name: entity.name,
      type: entity.type,
      created_at: entity.created_at,
    });
  });
});
