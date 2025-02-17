package main

import (
	"context"
	"errors"
	"fmt"
	"os"
	"path"
)

type Note struct {
	Title string
	Body  string
}

type App struct {
	ctx context.Context
}

func NewApp() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) startup(ctx context.Context) {
	a.ctx = ctx
}

func (a *App) ReadNotesDir() ([]string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return []string{}, fmt.Errorf("could not access user home directory %s", err)
	}

	entries, err := os.ReadDir(path.Join(homeDir, ".daarbnotes"))
	if errors.Is(err, os.ErrNotExist) {
		err := os.Mkdir(path.Join(homeDir, ".daarbnotes"), os.FileMode(0700))
		if err != nil {
			return []string{}, fmt.Errorf("failed to create notes directory %s", err)
		}

		return a.ReadNotesDir()
	}

	if err != nil {
		return []string{}, fmt.Errorf("could not access user notes %s", err)
	}

	fileNames := make([]string, 0)

	for _, v := range entries {
		if !v.IsDir() {
			fileNames = append(fileNames, v.Name())
		}
	}

	return fileNames, nil
}

func (a *App) ReadNote(name string) (Note, error) {
	notesDir, err := getNotesDir()
	if err != nil {
		return Note{}, err
	}
	contents, err := os.ReadFile(path.Join(notesDir, name))
	if err != nil {
		return Note{}, err
	}

	return Note{Title: name, Body: string(contents)}, nil
}

func (a *App) WriteNote(name string, content string) {
	notes, _ := getNotesDir()
	os.WriteFile(path.Join(notes, name), []byte(content), os.FileMode(0700))
}

func getNotesDir() (string, error) {
	homeDir, err := os.UserHomeDir()
	if err != nil {
		return "", fmt.Errorf("could not access user home directory %s", err)
	}

	_, err = os.ReadDir(path.Join(homeDir, ".daarbnotes"))
	if err != nil {
		return "", err
	}

	return path.Join(homeDir, ".daarbnotes"), nil
}

func (a *App) DeleteNote(name string) error {
	homeDir, err := getNotesDir()
	if err != nil {
		return err
	}

	err = os.Remove(path.Join(homeDir, name))
	if err != nil {
		return nil
	}

	return nil
}

func (a *App) RenameNote(oldName string, newName string) error {
	homeDir, err := getNotesDir()
	if err != nil {
		return err
	}

	err = os.Rename(path.Join(homeDir, oldName), path.Join(homeDir, newName))
	if err != nil {
		return err
	}

	return nil
}
