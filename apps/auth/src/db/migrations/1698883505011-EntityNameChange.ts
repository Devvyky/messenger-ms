import { MigrationInterface, QueryRunner } from "typeorm";

export class EntityNameChange1698883505011 implements MigrationInterface {
    name = 'EntityNameChange1698883505011'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "firstName" TO "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" RENAME COLUMN "name" TO "firstName"`);
    }

}
