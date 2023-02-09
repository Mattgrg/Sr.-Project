if [ ! -d "venv/" ]; then
    echo "Creating virtual environment"
    python -m venv venv
    echo
fi

echo "Activating virtual environment"
. venv/bin/activate
echo

echo "Installing required python library"
pip install -r requirements.txt
echo
echo "Setup Complete"
