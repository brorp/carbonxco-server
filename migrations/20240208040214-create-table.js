'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000')
      },
      deleted_at: {
        type: Sequelize.BIGINT
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM("admin", "client", "applicant")
      }
    });

    await queryInterface.createTable('categories', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      }
    });

    await queryInterface.createTable('blogs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000')
      },
      deleted_at: {
        type: Sequelize.BIGINT
      },
      author: {
        type: Sequelize.STRING,
      },
      content: {
        type: Sequelize.TEXT,
      },
      category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "categories",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      slug: {
        type: Sequelize.TEXT,
      },
      meta_tag: {
        type: Sequelize.TEXT
      }
    });

    await queryInterface.createTable('teams', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000')
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      position: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      link: {
        type: Sequelize.STRING,
      },
    });

    await queryInterface.createTable('jobs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000')
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      requirement: {
        type: Sequelize.TEXT,
      },
      qualification: {
        type: Sequelize.TEXT,
      },
    });

    await queryInterface.createTable('careers', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000')
      },
      job_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "jobs",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
    });

    await queryInterface.createTable('faqs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      question: {
        type: Sequelize.STRING,
      },
      answer: {
        type: Sequelize.TEXT
      }
    });

    await queryInterface.createTable('documents', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000')
      },
      reference_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      reference_type: {
        allowNull: false,
        type: Sequelize.ENUM("careers", "projects", "pages", "blogs", "teams")
      },
      key: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      document_type: {
        type: Sequelize.STRING,
        allowNull: false
      }
    });

    await queryInterface.createTable('projects', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.BIGINT,
        defaultValue: Sequelize.literal('EXTRACT(EPOCH FROM NOW()) * 1000')
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      start_date: {
        type: Sequelize.BIGINT,
      },
      location: {
        type: Sequelize.STRING,
      },
      area: {
        type: Sequelize.STRING,
      },
      ecosystem_type: {
        type: Sequelize.TEXT,
      },
      community: {
        type: Sequelize.TEXT,
      },
      main_goal: {
        type: Sequelize.TEXT,
      },
      key_factor: {
        type: Sequelize.TEXT,
      },
      other: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM("Origination", "Due dilligence", "Development", "Implementation", "Issuance"),
      }
      
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('faqs');
    await queryInterface.dropTable('careers');
    await queryInterface.dropTable('jobs');
    await queryInterface.dropTable('blogs');
    await queryInterface.dropTable('teams');
    await queryInterface.dropTable('projects');
    await queryInterface.dropTable('documents');
    await queryInterface.dropTable('categories');
    await queryInterface.dropTable('users');
  }
};
