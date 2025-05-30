package database

import (
	"database/sql"
	"testing"

	_ "modernc.org/sqlite"

	"github.com/juliotinti/fullCycle_courses/internal/entity"
	"github.com/stretchr/testify/suite"
)

type AccountDBTestSuite struct {
	suite.Suite
	db        *sql.DB
	accountDB *AccountDB
	client    *entity.Client
}

func (suite *AccountDBTestSuite) SetupTest() {
	db, err := sql.Open("sqlite", ":memory:")
	suite.Nil(err)
	suite.db = db
	db.Exec("CREATE TABLE clients (id varchar(255), name varchar(255), email varchar(255), created_at date)")
	db.Exec("CREATE TABLE accounts (id varchar(255), client_id varchar(255), balance int, created_at date)")
	suite.accountDB = NewAccountDB(db)
	suite.client, _ = entity.NewClient("John", "j@j.com")
}

func (suite *AccountDBTestSuite) TearDownTest() {
	defer suite.db.Close()
	suite.db.Exec("DROP TABLE clients")
	suite.db.Exec("DROP TABLE accounts")
}

func TestAccountDBTestSuite(t *testing.T) {
	suite.Run(t, new(ClientDBTestSuite))
}

func (suite *AccountDBTestSuite) TestSave() {
	account := entity.NewAccount(suite.client)
	err := suite.accountDB.Save(account)
	suite.Nil(err)
}

func (suite *AccountDBTestSuite) TestFindById() {
	suite.db.Exec("INSERT INTO clients (id, name, email, created_at) VALUES (?, ?, ?, ?)",
		suite.client.ID, suite.client.Name, suite.client.Email, suite.client.CreatedAt,
	)
	account := entity.NewAccount(suite.client)
	err := suite.accountDB.Save(account)
	suite.Nil(err)
	accountDB, err := suite.accountDB.FindById(account.ID)
	suite.Nil(err)
	suite.Equal(account.ID, accountDB.ID)
	suite.Equal(account.Client.ID, accountDB.Client.ID)
	suite.Equal(account.Balance, accountDB.Balance)
	suite.Equal(account.CreatedAt, accountDB.CreatedAt)
	suite.Equal(suite.client.ID, accountDB.Client.ID)
	suite.Equal(suite.client.Name, accountDB.Client.Name)
	suite.Equal(suite.client.Email, accountDB.Client.Email)
	suite.Equal(suite.client.CreatedAt, accountDB.Client.CreatedAt)
}
