'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        default: Sequelize.UUIDV4,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
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

    await queryInterface.createTable('Blogs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      author: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING
      },
      content: {
        type: Sequelize.TEXT,
      },
      category: {
        type: Sequelize.ENUM('news','insight','all_about_carbon'),
      },
      meta_title: {
        type: Sequelize.STRING
      },
      meta_description: {
        type: Sequelize.STRING
      },
    });

    await queryInterface.createTable('Teams', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
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

    await queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
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
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      qualification: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
    });

    await queryInterface.createTable('Careers', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      job_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Jobs",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
    });

    await queryInterface.createTable('Faqs', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      question: {
        type: Sequelize.STRING,
      },
      answer: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      is_archived: {
        type: Sequelize.BOOLEAN,
        default: false
      }
    });

    await queryInterface.createTable('Documents', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
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

    await queryInterface.createTable('Projects', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
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
      sdg: {
        type: Sequelize.ARRAY(Sequelize.STRING),
      },
      status: {
        type: Sequelize.ENUM("Origination", "Due dilligence", "Development", "Implementation", "Issuance"),
      }
    });

    await queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      user_id: {
        allowNull: false,
        type: Sequelize.UUID,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      subject: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.TEXT
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Faqs');
    await queryInterface.dropTable('Clients')
    await queryInterface.dropTable('Careers');
    await queryInterface.dropTable('Jobs');
    await queryInterface.dropTable('Blogs');
    await queryInterface.dropTable('Teams');
    await queryInterface.dropTable('Projects');
    await queryInterface.dropTable('Documents');
    await queryInterface.dropTable('Users');
  }
};
