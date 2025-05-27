package database

import (
	"database/sql"
	"testing"

	_ "modernc.org/sqlite"

	"github.com/juliotinti/fullCycle_courses/internal/entity"
	"github.com/stretchr/testify/suite"
)

type ClientDBTestSuite struct {
	suite.Suite
	db       *sql.DB
	clientDB *ClientDB
}

func (suite *ClientDBTestSuite) SetupTest() {
	db, err := sql.Open("sqlite", ":memory:")
	suite.Nil(err)
	suite.db = db
	suite.db.Exec("Create table clients (id varchar(255), name varchar(255), email varchar(255), created_at date)")
	suite.clientDB = NewClientDB(db)
}

func (suite *ClientDBTestSuite) TearDownTest() {
	defer suite.db.Close()
	suite.db.Exec("DROP TABLE clients")
}

func TestClientDBTestSuite(t *testing.T) {
	suite.Run(t, new(ClientDBTestSuite))
}

func (suite *ClientDBTestSuite) TestSave() {
	client := &entity.Client{
		ID:    "123",
		Name:  "John",
		Email: "j@j.com"}
	err := suite.clientDB.Save(client)
	suite.Nil(err)
}

func (suite *ClientDBTestSuite) TestGet() {
	client, _ := entity.NewClient("John", "j@j.com")
	suite.clientDB.Save(client)

	clientDB, err := suite.clientDB.Get(client.ID)
	suite.Nil(err)
	suite.Equal(client.ID, clientDB.ID)
	suite.Equal(client.Name, clientDB.Name)
	suite.Equal(client.Email, clientDB.Email)
}
