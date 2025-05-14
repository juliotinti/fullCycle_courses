package entity

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCreateNewAccount(t *testing.T) {
	client, _ := NewClient("test", "j@J")
	account := NewAccount(client)
	assert.NotNil(t, account)
	assert.Equal(t, account.Client.ID, client.ID)
}

func TestCreateAccountWithNilClient(t *testing.T) {
	account := NewAccount(nil)
	assert.Nil(t, account)
}

func TestCreditAccount(t *testing.T) {
	client, _ := NewClient("john doe", "j@j")
	account := NewAccount(client)
	account.Credit(100)
	assert.Equal(t, account.Balance, 100.0)
}

func TestDebitAccount(t *testing.T) {
	client, _ := NewClient("john doe", "j@j")
	account := NewAccount(client)
	account.Credit(100)
	account.Debit(50)
	assert.Equal(t, account.Balance, 50.0)
}
