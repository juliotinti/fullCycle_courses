package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateNewClient_whenArgumentsIsCorrect_shouldCreate(t *testing.T) {
	name := "John Doe"
	email := "j@j.com"
	client, err := NewClient(name, email)
	assert.Nil(t, err)
	assert.Equal(t, name, client.Name)
	assert.Equal(t, email, client.Email)
}

func TestCreateNewClient_whenArgumentsIsInvalid_shouldThrowError(t *testing.T) {
	name := ""
	email := ""
	client, err := NewClient(name, email)
	assert.NotNil(t, err)
	assert.Nil(t, client)
}

func TestUpdateClient_whenArgumentsIsCorrect_shouldUpdate(t *testing.T) {
	name := "John Doe"
	email := "j@j.com"
	updatedName := "John Doe Updated"
	updatedEmail := "j@.com"
	client, err := NewClient(name, email)
	client.Update(updatedName, updatedEmail)
	assert.Nil(t, err)
	assert.Equal(t, updatedName, client.Name)
	assert.Equal(t, updatedEmail, client.Email)
}

func TestUpdateClient_whenArgumentsIsInvalid_shouldThrowError(t *testing.T) {
	name := "John Doe"
	email := "j@j.com"
	updatedName := ""
	updatedEmail := ""
	client, _ := NewClient(name, email)
	err := client.Update(updatedName, updatedEmail)
	assert.NotNil(t, err)
	assert.Error(t, err, "name is required")
}

func TestAddAccount_whenArgumentsIsCorrect_shouldAdd(t *testing.T) {
	name := "John Doe"
	email := "j@j"
	client, _ := NewClient(name, email)
	account := NewAccount(client)
	err := client.AddAccount(account)
	assert.Nil(t, err)
	assert.Equal(t, 1, len(client.Accounts))
	assert.Equal(t, account.Client.ID, client.ID)
	assert.Equal(t, account.Client.Name, client.Name)
	assert.Equal(t, account.Client.Email, client.Email)
}
